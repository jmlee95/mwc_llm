# -*- mode: python ; coding: utf-8 -*-

import sys
from PyInstaller.utils.hooks import collect_all

block_cipher = None

# 필요한 패키지들의 데이터 수집
datas = [
    ('static', 'static'),
    ('templates', 'templates'),
    ('knwlgFile', 'knwlgFile')
]

# Flask 관련 데이터 수집
flask_bins, flask_datas, flask_hiddenimports = collect_all('flask')
werkzeug_bins, werkzeug_datas, werkzeug_hiddenimports = collect_all('werkzeug')
jinja2_bins, jinja2_datas, jinja2_hiddenimports = collect_all('jinja2')
click_bins, click_datas, click_hiddenimports = collect_all('click')

hiddenimports = [
    'flask',
    'flask.cli',
    'werkzeug',
    'werkzeug.routing',
    'werkzeug.middleware',
    'werkzeug.middleware.proxy_fix',
    'jinja2',
    'jinja2.ext',
    'click',
    'webbrowser'
]
hiddenimports.extend(flask_hiddenimports)
hiddenimports.extend(werkzeug_hiddenimports)
hiddenimports.extend(jinja2_hiddenimports)
hiddenimports.extend(click_hiddenimports)

a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[*flask_bins, *werkzeug_bins, *jinja2_bins, *click_bins],
    datas=[*datas, *flask_datas, *werkzeug_datas, *jinja2_datas, *click_datas],
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False
)

pyz = PYZ(
    a.pure,
    a.zipped_data,
    cipher=block_cipher
)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='KT_MWC_Demo',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,  # 디버깅을 위해 콘솔창 표시로 변경
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None
)
