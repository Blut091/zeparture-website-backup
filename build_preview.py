import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

css = read("css/style.css")
config_js = read("js/config.js")
whatsapp_js = read("js/whatsapp.js")
main_js = read("js/main.js")
three_js = read("js/three-scene.js")

html = html.replace(
    '<link rel="stylesheet" href="css/style.css" />',
    f"<style>\n{css}\n</style>"
)

html = html.replace(
    '<script src="js/config.js"></script>',
    f"<script>\n{config_js}\n</script>"
)
html = html.replace(
    '<script src="js/whatsapp.js"></script>',
    f"<script>\n{whatsapp_js}\n</script>"
)
html = html.replace(
    '<script src="js/main.js"></script>',
    f"<script>\n{main_js}\n</script>"
)
html = html.replace(
    '<script type="module" src="js/three-scene.js"></script>',
    f'<script type="module">\n{three_js}\n</script>'
)

with open("preview.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Done. Size:", len(html), "chars")
