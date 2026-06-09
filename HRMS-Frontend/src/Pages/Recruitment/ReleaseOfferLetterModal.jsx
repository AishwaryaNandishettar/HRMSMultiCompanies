import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ReleaseOfferLetterModal.css";

import {
  renderPdfToImages,
  replacePlaceholdersInPdf,
  extractEditableFields,
  applyFieldEditsTopdf,
} from "./pdfUtils";
import {
  uploadOfferTemplate,
  getAllTemplates,
  getTemplatePreview,
  saveOfferLetter,
  sendOfferLetterEmail,
  deleteTemplate,
} from "../../api/recruitmentApi";

// ── Word-like toolbar commands ──
const execCmd = (cmd, value = null) => {
  document.execCommand(cmd, false, value);
};

// ── Isolated Word Editor Component ──
// Using React.memo so parent state changes NEVER re-render this component.
// The editor owns its own DOM — React never touches innerHTML after mount.
const WordEditor = React.memo(function WordEditor({ initialHtml, editorRef, onSendEmail, onDownload, downloading }) {
  const [fontSize, setFontSize] = React.useState("3");

  // Inject HTML once on mount only
  React.useEffect(() => {
    if (editorRef.current && initialHtml) {
      editorRef.current.innerHTML = initialHtml;
      editorRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty deps = runs once on mount only

  return (
    <div className="word-editor-section">
      {/* ── TOOLBAR ── */}
      <div className="word-toolbar">
        <div className="word-toolbar-group">
          <button className="word-tool-btn" title="Bold (Ctrl+B)" onMouseDown={(e) => { e.preventDefault(); execCmd("bold"); }}><b>B</b></button>
          <button className="word-tool-btn" title="Italic (Ctrl+I)" onMouseDown={(e) => { e.preventDefault(); execCmd("italic"); }}><i>I</i></button>
          <button className="word-tool-btn" title="Underline (Ctrl+U)" onMouseDown={(e) => { e.preventDefault(); execCmd("underline"); }}><u>U</u></button>
        </div>
        <div className="word-toolbar-divider" />
        <div className="word-toolbar-group">
          <button className="word-tool-btn" title="Align Left"   onMouseDown={(e) => { e.preventDefault(); execCmd("justifyLeft"); }}>≡</button>
          <button className="word-tool-btn" title="Align Center" onMouseDown={(e) => { e.preventDefault(); execCmd("justifyCenter"); }}>☰</button>
          <button className="word-tool-btn" title="Align Right"  onMouseDown={(e) => { e.preventDefault(); execCmd("justifyRight"); }}>≡</button>
        </div>
        <div className="word-toolbar-divider" />
        <div className="word-toolbar-group">
          <select
            className="word-font-select"
            title="Font Size"
            value={fontSize}
            onChange={(e) => { setFontSize(e.target.value); execCmd("fontSize", e.target.value); }}
          >
            <option value="1">8</option>
            <option value="2">10</option>
            <option value="3">12</option>
            <option value="4">14</option>
            <option value="5">18</option>
            <option value="6">24</option>
            <option value="7">36</option>
          </select>
        </div>
        <div className="word-toolbar-divider" />
        <div className="word-toolbar-group">
          <input type="color" className="word-color-pick" title="Text Color" defaultValue="#000000"
            onInput={(e) => execCmd("foreColor", e.target.value)} />
          <button className="word-tool-btn" title="Highlight" onMouseDown={(e) => { e.preventDefault(); execCmd("hiliteColor", "#fef08a"); }}>🖍</button>
        </div>
        <div className="word-toolbar-divider" />
        <div className="word-toolbar-group">
          <button className="word-tool-btn" title="Bullet List"   onMouseDown={(e) => { e.preventDefault(); execCmd("insertUnorderedList"); }}>• List</button>
          <button className="word-tool-btn" title="Numbered List" onMouseDown={(e) => { e.preventDefault(); execCmd("insertOrderedList"); }}>1. List</button>
        </div>
        <div className="word-toolbar-divider" />
        <div className="word-toolbar-group">
          <button className="word-tool-btn word-tool-undo" title="Undo (Ctrl+Z)" onMouseDown={(e) => { e.preventDefault(); execCmd("undo"); }}>↩ Undo</button>
          <button className="word-tool-btn word-tool-redo" title="Redo (Ctrl+Y)" onMouseDown={(e) => { e.preventDefault(); execCmd("redo"); }}>↪ Redo</button>
        </div>
      </div>

      {/* ── DOCUMENT BODY ── */}
      <div className="word-page-wrap">
        <div className="word-page">
          <div
            ref={editorRef}
            className="word-editor-body"
            contentEditable
            suppressContentEditableWarning
            spellCheck
            style={{ outline: "none", minHeight: "600px" }}
          />
        </div>
      </div>

      {/* ── ACTION BUTTONS ── */}
      <div className="form-actions">
        <button className="btn-secondary" onClick={onSendEmail}>📧 Send Offer Letter</button>
        <button className="btn-primary" onClick={onDownload} disabled={downloading}>
          {downloading ? "Generating..." : "📥 Download PDF"}
        </button>
      </div>
    </div>
  );
});

export default function ReleaseOfferLetterModal({ job, onClose }) {

  // ── TABS ──
  const [activeTab, setActiveTab] = useState("upload");

  // ── FORM DATA ──
  const [form, setForm] = useState({
    candidateName: job?.candidateName || "",
    candidateEmail: job?.candidateEmail || "",
    position: job?.jobTitle || "",
    department: job?.department || "",
    location: job?.location || "",
    joiningDate: job?.onboardingDate || "",
    ctc: job?.ctc || "",
    basic: job?.basic || "",
    hra: job?.hra || "",
    allowances: job?.allowances || "",
    bonus: job?.bonus || "",
    probationPeriod: "3 months",
    noticePeriod: job?.noticePeriod || "60 days",
    offerValidUntil: "",
    companyName: "OMOIKANE INNOVATIONS PVT LTD",
    grade: "",
    grossSalary: "",
    variablePay: "",
  });

  // ── TEMPLATE STATE ──
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMetadata, setUploadMetadata] = useState({
    templateName: "",
    companyName: "",
    description: "",
  });

  // ── PDF STATE ──
  const [pdfPageImages, setPdfPageImages] = useState([]);
  // editableFields: array of { page, index, originalText, value, x, y, width, height, fontSize, pageWidth, pageHeight }
  const [editableFields, setEditableFields] = useState([]);
  const [pdfRendering, setPdfRendering] = useState(false);

  // ── STATUS ──
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(null); // Track which template is being deleted

  // ── INLINE EDIT STATE ──
  // When user clicks a field, show an inline input overlay instead of prompt()
  const [activeEdit, setActiveEdit] = useState(null); // { field, inputValue }

  // ── WORD EDITOR STATE ──
  // Store initial HTML as a ref — changing it does NOT trigger a re-render.
  // The WordEditor component is memoized and only mounts once per tab switch.
  const wordEditorHtmlRef = useRef("");
  const editorRef = useRef(null);
  // Key forces WordEditor to fully remount when a new template loads
  const [editorKey, setEditorKey] = useState(0);

  const fileInputRef = useRef(null);
  // refs to each page image element so we can measure rendered size
  const pageImgRefs = useRef([]);

  // ── LOAD TEMPLATES ON MOUNT ──
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getAllTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load templates:", err);
      setTemplates([]);
    }
  };

  // ── HANDLE FILE SELECTION ──
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) { setStatus({ type: "error", message: "No file selected" }); return; }
    if (file.type !== "application/pdf") {
      setStatus({ type: "error", message: "Please select a PDF file." }); return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus({ type: "error", message: "File too large (max 10 MB)." }); return;
    }
    setUploadFile(file);
    setStatus({ type: "info", message: `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)` });
  };

  // ── UPLOAD TEMPLATE ──
  const handleUploadTemplate = async () => {
    if (!uploadFile) { setStatus({ type: "error", message: "Please select a PDF file" }); return; }
    if (!uploadMetadata.templateName || !uploadMetadata.companyName) {
      setStatus({ type: "error", message: "Template name and company name are required" }); return;
    }
    setUploading(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("templateName", uploadMetadata.templateName.trim());
      formData.append("companyName", uploadMetadata.companyName.trim());
      formData.append("description", uploadMetadata.description.trim());
      formData.append("uploadedBy", "Admin");

      const response = await uploadOfferTemplate(formData);
      const templateId = response?.templateId || response?.data?.templateId;
      if (!templateId) throw new Error("No template ID received from server.");

      setStatus({ type: "success", message: "Template uploaded successfully!" });
      await loadTemplates();
      setSelectedTemplate(templateId);
      await loadTemplatePreview(templateId);
      setActiveTab("preview");
      setUploadFile(null);
      setUploadMetadata({ templateName: "", companyName: "", description: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      let msg = err?.response?.data?.message || err?.message || "Upload failed";
      if (msg.includes("pattern data")) msg = "File upload validation error. Try a different PDF.";
      setStatus({ type: "error", message: msg });
    } finally {
      setUploading(false);
    }
  };

  // ── LOAD TEMPLATE PREVIEW ──
  const loadTemplatePreview = async (templateId) => {
    if (!templateId) { setStatus({ type: "error", message: "No template ID provided" }); return; }
    setPdfRendering(true);
    setStatus({ type: "info", message: "Loading template preview..." });
    try {
      const response = await getTemplatePreview(templateId);
      if (!response?.pdfBase64) throw new Error("No PDF data received from server.");

      const base64 = response.pdfBase64;
      const binaryString = window.atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

      if (String.fromCharCode(...bytes.slice(0, 4)) !== "%PDF")
        throw new Error("Invalid PDF format.");

      // Store master copy
      window.originalPdfBytes = bytes.buffer.slice(0);

      // Render images
      const images = await renderPdfToImages(bytes.buffer.slice(0));
      if (!images || images.length === 0) throw new Error("PDF rendering failed.");
      setPdfPageImages(images);

      // Extract ALL text fields for editing
      const fields = await extractEditableFields(bytes.buffer.slice(0));
      setEditableFields(fields);

      setStatus({ type: "success", message: `Template loaded successfully (${images.length} page${images.length > 1 ? "s" : ""})` });

      // ── Build word-editor HTML from extracted text fields ──
      // Group fields by page and sort by Y (top to bottom), then X
      const sorted = [...fields].sort((a, b) =>
        a.page !== b.page ? a.page - b.page :
        b.y !== a.y ? b.y - a.y : a.x - b.x
      );
      
      // Build readable HTML lines from PDF text items
      // Group consecutive text items that are on the same line
      const lines = [];
      let currentY = null;
      let currentLine = [];
      
      sorted.forEach(field => {
        const text = field.value || field.originalText || "";
        if (!text.trim()) return;
        
        // If this is a new line (different Y position with some tolerance)
        if (currentY === null || Math.abs(field.y - currentY) > 5) {
          // Finish the current line
          if (currentLine.length > 0) {
            lines.push(currentLine.join(" "));
          }
          // Start a new line
          currentLine = [text];
          currentY = field.y;
        } else {
          // Same line, add to current line
          currentLine.push(text);
        }
      });
      
      // Don't forget the last line
      if (currentLine.length > 0) {
        lines.push(currentLine.join(" "));
      }
      
      // Convert lines to HTML paragraphs
      const htmlLines = lines.map(line =>
        `<p style="margin:6px 0;line-height:1.4;font-size:14px;">${line.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>`
      ).join("");
      
      const newHtml = htmlLines || "<p>Start typing your offer letter here...</p>";
      
      console.log("Word editor HTML built:");
      console.log("Fields:", fields.length);
      console.log("Lines created:", lines.length);
      console.log("Sample lines:", lines.slice(0, 3));
      
      // Store in ref (no re-render) and bump key to remount WordEditor cleanly
      wordEditorHtmlRef.current = newHtml;
      setEditorKey(k => k + 1);
    } catch (err) {
      console.error("Failed to load template:", err);
      setStatus({ type: "error", message: err?.message || "Failed to load template" });
      setPdfPageImages([]);
      setEditableFields([]);
    } finally {
      setPdfRendering(false);
    }
  };

  // ── SELECT EXISTING TEMPLATE ──
  const handleSelectTemplate = async (templateId) => {
    setSelectedTemplate(templateId);
    await loadTemplatePreview(templateId);
    setActiveTab("preview");
  };

  // ── DELETE TEMPLATE ──
  const handleDeleteTemplate = async (templateId, templateName) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete the template "${templateName}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    setDeleting(templateId);
    try {
      await deleteTemplate(templateId);
      setStatus({ type: "success", message: `Template "${templateName}" deleted successfully!` });
      
      // Reload templates list
      await loadTemplates();
      
      // If the deleted template was selected, clear the selection
      if (selectedTemplate === templateId) {
        setSelectedTemplate(null);
        setPdfPageImages([]);
        setEditableFields([]);
        wordEditorHtmlRef.current = "";
        setEditorKey(k => k + 1);
      }
      
    } catch (err) {
      console.error("Failed to delete template:", err);
      setStatus({ 
        type: "error", 
        message: `Failed to delete template: ${err?.response?.data?.message || err?.message || "Unknown error"}` 
      });
    } finally {
      setDeleting(null);
    }
  };

  // ── CLICK ON A TEXT FIELD IN EDIT MODE ──
  const handleFieldClick = (field) => {
    setActiveEdit({ field, inputValue: field.value });
  };

  // ── CONFIRM INLINE EDIT ──
  const handleEditConfirm = () => {
    if (!activeEdit) return;
    const { field, inputValue } = activeEdit;
    const updatedFields = editableFields.map(f =>
      f.page === field.page && f.index === field.index
        ? { ...f, value: inputValue }
        : f
    );
    setEditableFields(updatedFields);
    setActiveEdit(null);
    // Re-render preview with updated text
    updatePdfPreviewWithFields(updatedFields);
  };

  // ── CANCEL INLINE EDIT ──
  const handleEditCancel = () => setActiveEdit(null);

  // ── RE-RENDER PDF WITH EDITED FIELDS ──
  const updatePdfPreviewWithFields = async (fields) => {
    if (!window.originalPdfBytes) return;
    setPdfRendering(true);
    try {
      const freshBuffer = window.originalPdfBytes.slice(0);
      // Apply all field edits (white-out original text, draw new text)
      const modifiedPdf = await applyFieldEditsTopdf(freshBuffer, fields);
      const images = await renderPdfToImages(modifiedPdf.buffer);
      setPdfPageImages(images);
    } catch (err) {
      console.error("Failed to update preview:", err);
    } finally {
      setPdfRendering(false);
    }
  };

  // ── DOWNLOAD FINAL PDF ──
  const handleDownload = async () => {
    if (!window.originalPdfBytes) {
      setStatus({ type: "error", message: "No template loaded" }); return;
    }
    setDownloading(true);
    try {
      const freshBuffer = window.originalPdfBytes.slice(0);
      
      // Get the current content from the word editor
      const editorEl = editorRef.current;
      let finalPdfBytes;
      
      if (editorEl && editableFields.length > 0) {
        // Extract all text content from the word editor
        const editorHtml = editorEl.innerHTML || "";
        const editorText = editorEl.innerText || "";
        
        // Create updated fields based on the editor content
        // We'll map the editor content to the original PDF fields more intelligently
        const updatedFields = [...editableFields];
        
        // Split editor text into paragraphs and lines
        const editorParagraphs = editorText.split(/\n\n+/).filter(p => p.trim());
        const editorLines = editorText.split(/\n/).filter(l => l.trim());
        
        console.log("Editor content analysis:");
        console.log("Paragraphs:", editorParagraphs.length);
        console.log("Lines:", editorLines.length);
        console.log("Original fields:", editableFields.length);
        
        // Strategy: Map editor lines to PDF fields by position and content similarity
        let lineIndex = 0;
        
        for (let i = 0; i < updatedFields.length && lineIndex < editorLines.length; i++) {
          const field = updatedFields[i];
          const editorLine = editorLines[lineIndex];
          
          // Skip very short original text (likely formatting elements)
          if (!field.originalText || field.originalText.length < 2) {
            continue;
          }
          
          // Map this field to current editor line
          if (editorLine && editorLine.trim()) {
            updatedFields[i] = {
              ...field,
              value: editorLine.trim()
            };
            lineIndex++;
            console.log(`Mapped field ${i}: "${field.originalText}" -> "${editorLine.trim()}"`);
          }
        }
        
        // Apply the mapped field edits to PDF
        const withEdits = await applyFieldEditsTopdf(freshBuffer, updatedFields);
        finalPdfBytes = await replacePlaceholdersInPdf(withEdits.buffer || withEdits, form);
      } else {
        // Fallback: use existing field edits
        const withEdits = await applyFieldEditsTopdf(freshBuffer, editableFields);
        finalPdfBytes = await replacePlaceholdersInPdf(withEdits.buffer || withEdits, form);
      }

      const blob = new Blob([finalPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Offer_Letter_${(form.candidateName || "Candidate").replace(/\s+/g, "_")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setStatus({ type: "success", message: "PDF downloaded successfully!" });

      try {
        await saveOfferLetter({
          ...form,
          jobId: job?.id,
          templateId: selectedTemplate,
          generatedAt: new Date().toISOString(),
        });
      } catch (_) { /* silent */ }
    } catch (err) {
      setStatus({ type: "error", message: "Download failed: " + (err?.message || "Unknown error") });
    } finally {
      setDownloading(false);
    }
  };

  // ── SEND EMAIL ──
  const handleSendEmail = async () => {
    if (!window.originalPdfBytes) {
      setStatus({ type: "error", message: "No template loaded" }); 
      return;
    }

    // ✅ Prompt user to enter recipient email address
    const recipientEmail = prompt(
      "Enter recipient email address:",
      form.candidateEmail || ""
    );

    // User cancelled or entered empty email
    if (!recipientEmail || recipientEmail.trim() === "") {
      setStatus({ type: "info", message: "Email sending cancelled" });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail.trim())) {
      setStatus({ type: "error", message: "Invalid email address format" });
      return;
    }

    setStatus({ type: "info", message: "Sending email..." });

    try {
      const freshBuffer = window.originalPdfBytes.slice(0);
      
      // Get the current content from the word editor (same logic as download)
      const editorEl = editorRef.current;
      let finalPdfBytes;
      
      if (editorEl && editableFields.length > 0) {
        // Extract all text content from the word editor
        const editorText = editorEl.innerText || "";
        
        // Create updated fields based on the editor content
        const updatedFields = [...editableFields];
        
        // Split editor text into lines
        const editorLines = editorText.split(/\n/).filter(l => l.trim());
        
        console.log("Email: Editor content analysis:");
        console.log("Lines:", editorLines.length);
        console.log("Original fields:", editableFields.length);
        
        // Map editor lines to PDF fields
        let lineIndex = 0;
        
        for (let i = 0; i < updatedFields.length && lineIndex < editorLines.length; i++) {
          const field = updatedFields[i];
          const editorLine = editorLines[lineIndex];
          
          // Skip very short original text (likely formatting elements)
          if (!field.originalText || field.originalText.length < 2) {
            continue;
          }
          
          // Map this field to current editor line
          if (editorLine && editorLine.trim()) {
            updatedFields[i] = {
              ...field,
              value: editorLine.trim()
            };
            lineIndex++;
            console.log(`Email: Mapped field ${i}: "${field.originalText}" -> "${editorLine.trim()}"`);
          }
        }
        
        // Apply the mapped field edits to PDF
        const withEdits = await applyFieldEditsTopdf(freshBuffer, updatedFields);
        finalPdfBytes = await replacePlaceholdersInPdf(withEdits, form);
      } else {
        // Fallback: use existing field edits
        const withEdits = await applyFieldEditsTopdf(freshBuffer, editableFields);
        finalPdfBytes = await replacePlaceholdersInPdf(withEdits, form);
      }

      const blob = new Blob([finalPdfBytes], { type: "application/pdf" });
      const candidateName = form.candidateName || "Candidate";
      const file = new File(
        [blob], 
        `Offer_Letter_${candidateName.replace(/\s+/g, "_")}.pdf`, 
        { type: "application/pdf" }
      );

      const emailFormData = new FormData();
      emailFormData.append("to", recipientEmail.trim());
      emailFormData.append("subject", `Offer Letter - ${form.position || "Position"}`);
      emailFormData.append("candidateName", candidateName);
      emailFormData.append("file", file);

      console.log("Sending email to:", recipientEmail.trim());

      // ✅ Use axios instance — automatically picks up VITE_API_BASE_URL
      // so it works both on localhost and after Vercel deployment
      await sendOfferLetterEmail(emailFormData);

      setStatus({ 
        type: "success", 
        message: `✅ Offer letter sent successfully to ${recipientEmail}!` 
      });

      // Update form with the email used
      setForm(prev => ({ ...prev, candidateEmail: recipientEmail.trim() }));

    } catch (err) {
      console.error("Email sending error:", err);
      setStatus({ 
        type: "error", 
        message: `Email sending failed: ${err.message || "Unknown error"}` 
      });
    }
  };

  // ── COMPUTE OVERLAY POSITION ──
  // PDF coords: origin bottom-left, Y increases upward.
  // CSS coords: origin top-left, Y increases downward.
  // We need to flip Y and scale from PDF points to rendered pixels.
  const getOverlayStyle = (field, pageIdx) => {
    const imgEl = pageImgRefs.current[pageIdx];
    if (!imgEl || !field.pageWidth || !field.pageHeight) {
      // Fallback: just use raw coords (will be approximate)
      return {
        position: "absolute",
        left: `${field.x}px`,
        top: `${field.y}px`,
        width: `${field.width || 80}px`,
        height: `${field.height || 16}px`,
      };
    }

    const renderedW = imgEl.clientWidth;
    const renderedH = imgEl.clientHeight;

    const scaleX = renderedW / field.pageWidth;
    const scaleY = renderedH / field.pageHeight;

    // PDF Y is from bottom; CSS Y is from top
    const cssLeft = field.x * scaleX;
    const cssTop = renderedH - (field.y + field.height) * scaleY;
    const cssWidth = (field.width || 80) * scaleX;
    const cssHeight = (field.height || 16) * scaleY;

    return {
      position: "absolute",
      left: `${cssLeft}px`,
      top: `${cssTop}px`,
      width: `${cssWidth}px`,
      height: `${Math.max(cssHeight, 14)}px`,
    };
  };

  // ── RENDER ──
  return (
    <div className="release-offer-modal-overlay" onClick={onClose}>
      <div className="release-offer-modal" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal-header">
          <h2>📄 Release Offer Letter</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* TABS */}
        <div className="modal-tabs">
          <button className={activeTab === "upload" ? "active" : ""} onClick={() => setActiveTab("upload")}>
            📤 Upload Template
          </button>
          <button
            className={activeTab === "preview" ? "active" : ""}
            onClick={() => setActiveTab("preview")}
            disabled={pdfPageImages.length === 0}
          >
            👁️ Preview
          </button>
          <button
            className={activeTab === "edit" ? "active" : ""}
            onClick={() => setActiveTab("edit")}
            disabled={pdfPageImages.length === 0}
          >
            ✏️ Edit Fields
          </button>
        </div>

        {/* STATUS */}
        {status && <div className={`status-message ${status.type}`}>{status.message}</div>}

        {/* BODY */}
        <div className="modal-body" onClick={(e) => e.stopPropagation()}>

          {/* ── UPLOAD TAB ── */}
          {activeTab === "upload" && (
            <div className="upload-section">
              <h3>Upload New Template</h3>
              <div className="upload-form">
                <div className="form-group">
                  <label>Template Name *</label>
                  <input type="text" placeholder="e.g., Standard Offer Letter"
                    value={uploadMetadata.templateName}
                    onChange={(e) => setUploadMetadata(p => ({ ...p, templateName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input type="text" placeholder="e.g., OMOIKANE INNOVATIONS"
                    value={uploadMetadata.companyName}
                    onChange={(e) => setUploadMetadata(p => ({ ...p, companyName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Description (Optional)</label>
                  <textarea placeholder="Brief description" value={uploadMetadata.description} rows={3}
                    onChange={(e) => setUploadMetadata(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Select PDF Template *</label>
                  <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileSelect} />
                  {uploadFile && <div className="file-info">✅ {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)</div>}
                </div>
                <button className="btn-primary" onClick={handleUploadTemplate} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Template"}
                </button>
              </div>

              <hr />

              <h3>Or Select Existing Template</h3>
              <div className="templates-grid">
                {templates.length === 0 ? (
                  <p className="no-templates">No templates available. Upload one above.</p>
                ) : (
                  templates.map(t => (
                    <div key={t.id}
                      className={`template-card ${selectedTemplate === t.id ? "selected" : ""}`}>
                      <div className="template-content" onClick={() => handleSelectTemplate(t.id)}>
                        <div className="template-icon">📄</div>
                        <div className="template-name">{t.templateName}</div>
                        <div className="template-company">{t.companyName}</div>
                        <div className="template-date">{new Date(t.uploadedAt).toLocaleDateString()}</div>
                      </div>
                      <div className="template-actions">
                        <button 
                          className="delete-template-btn"
                          title="Delete Template"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTemplate(t.id, t.templateName);
                          }}
                          disabled={deleting === t.id}
                        >
                          {deleting === t.id ? "..." : "🗑️"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── PREVIEW TAB ── */}
          {activeTab === "preview" && (
            <div className="preview-section">
              <h3>Template Preview</h3>
              {pdfRendering ? (
                <div className="loading">Rendering PDF...</div>
              ) : pdfPageImages.length > 0 ? (
                <div className="pdf-preview">
                  {pdfPageImages.map((imgSrc, idx) => (
                    <div key={idx} className="pdf-page">
                      <img src={imgSrc} alt={`Page ${idx + 1}`} />
                      <div className="page-number">Page {idx + 1}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-preview">No preview available</div>
              )}
              <div className="preview-actions">
                <button className="btn-secondary" onClick={() => setActiveTab("edit")} disabled={pdfPageImages.length === 0}>
                  Next: Edit Fields →
                </button>
              </div>
            </div>
          )}

          {/* ── EDIT TAB — Word-like editor ── */}
          {activeTab === "edit" && (
            <WordEditor
              key={editorKey}
              initialHtml={wordEditorHtmlRef.current}
              editorRef={editorRef}
              onSendEmail={handleSendEmail}
              onDownload={handleDownload}
              downloading={downloading}
            />
          )}

          {/* ── DOWNLOAD TAB ── */}
          {activeTab === "download" && (
            <div className="download-section">
              <h3>Download Final PDF</h3>
              <div className="download-summary">
                <h4>Summary</h4>
                <div className="summary-grid">
                  <div className="summary-item"><strong>Candidate:</strong> {form.candidateName || "Not specified"}</div>
                  <div className="summary-item"><strong>Position:</strong> {form.position || "Not specified"}</div>
                  <div className="summary-item"><strong>CTC:</strong> {form.ctc || "Not specified"}</div>
                  <div className="summary-item"><strong>Joining Date:</strong> {form.joiningDate || "Not specified"}</div>
                </div>
              </div>
              <div className="download-actions">
                <button className="btn-primary large" onClick={handleDownload} disabled={downloading}>
                  {downloading ? "Generating PDF..." : "📥 Download Final Offer Letter"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
