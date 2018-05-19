@ECHO OFF
CD %~dp0
watchmedo shell-command --patterns="*.user.js" --command="python remove_js_imports.py ${watch_src_path}" .