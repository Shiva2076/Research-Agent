from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from io import BytesIO

def generate_pdf(query: str, report: str) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            leftMargin=2*cm, rightMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "Title", parent=styles["Title"],
        fontSize=16, spaceAfter=12, textColor=colors.HexColor("#1D9E75")
    )
    body_style = ParagraphStyle(
        "Body", parent=styles["Normal"],
        fontSize=10, leading=16, spaceAfter=8
    )

    story = [
        Paragraph("Research Agent Report", title_style),
        Paragraph(f"<b>Query:</b> {query}", body_style),
        Spacer(1, 0.5*cm),
    ]

    import re
    for line in report.split("\n"):
        line = line.strip()
        if line:
            # Simple markdown replacements
            line = re.sub(r'^##\s*(.*)', r'<b>\1</b>', line)  # Header 2
            line = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', line) # Bold
            story.append(Paragraph(line, body_style))
        else:
            story.append(Spacer(1, 0.2*cm))

    doc.build(story)
    return buffer.getvalue()
