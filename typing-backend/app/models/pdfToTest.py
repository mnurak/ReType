class pdfToText:
        
    def getText(self, doc):

        PARA_GAP_THRESHOLD = 15
        SPACE_WIDTH = 6 
        pages_output = []

        for page_index, page in enumerate(doc):
            
            blocks = page.get_text("dict")["blocks"]

            raw_lines = []

            for block in blocks:
                if "lines" not in block:
                    continue
                for line in block["lines"]:
                    text = "".join(span["text"] for span in line["spans"]).rstrip()
                    if text:
                        raw_lines.append({
                            "text": text,
                            "x": line["bbox"][0],
                            "y": line["bbox"][1]
                        })

            if not raw_lines:
                continue

            # Base left margin for indentation
            left_margin = min(line["x"] for line in raw_lines)

            structured = []
            prev_y = None

            for line in raw_lines:
                if prev_y is not None:
                    gap = line["y"] - prev_y
                    if gap > PARA_GAP_THRESHOLD:
                        structured.append({"type": "blank"})

                indent_spaces = round((line["x"] - left_margin) / SPACE_WIDTH)

                structured.append({
                    "type": "line",
                    "indent": max(indent_spaces, 0),
                    "text": line["text"]
                })

                prev_y = line["y"]

            pages_output.append({
                "page": page_index + 1,
                "content": structured
            })
            
        return pages_output
        
    def __call__(self, doc):
        return self.getText(doc)
