# Savings at the Frontiers - Excel-addin

Serves information from the database to the Excel addin.

Steps for installing:
Running at https://satf.azurewebsites.net/

    Web:
        1. Compile using tsc
        2. Upload to azure
        3. Go to http://excel.office.com/
        4. Start new sheet.
        5. Insert --> Addins --> Upload own --> excel_interface/manifest.xml

    Desktop:
    1. Copy excel_interface/manifest.xml to a local folder
    2. Share the folder containing the manifest file.
        Ensure that read/write privledges are added.
    3. Add the folder to excel trust center.
        i. file -> options -> Trust Center -> Trust Center Settings
        ii. add the shared location to 'Trusted Add-in catalogs'.
        iii. add the folder path to 'Trusted Locations'.

    Clear cache:
        %userprofile%\AppData\Local\Packages\Microsoft.Win32WebViewHost_cw5n1h2txyewy\AC\#!123\INetCache\
        %LOCALAPPDATA%\Microsoft\Office\16.0\Wef\

    Loopback exception for local dev:
        CheckNetIsolation LoopbackExempt -a -n="microsoft.win32webviewhost_cw5n1h2txyewy"

    Remeber to install certificate in certs.
        1. Go to {project root}\certs.
        2. Double-click server.crt, and select Install Certificate.
        3. Select Local Machine and select Next to continue.
        4. Select Place all certificates in the following store and then select Browse.
        5. Select Trusted Root Certification Authorities and then select OK.
        6. Select Next and then Finish.

        chrome://flags/#allow-insecure-localhost

Copyright: NIRAS A/S
License: Undisclosed

There are two environments
DEV and PROD
PROD is at https://satfstatic.z6.web.core.windows.net/?page=map
DEV is at https://satfstaticdev.z6.web.core.windows.net/?page=map

To build:
Run npm run build - Do not run tsc
Right click "dist" folder at upload to satf_static @ azure
