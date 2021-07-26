# Savings at the Frontiers - Excel-addin

This is the excel interface for the satf-api and database.

The interface is built using Typescript, OfficeJS, React, LeafletJS. It requires a valid
version of the satf-api running in order to function.

_Author_: **Casper Fibaek**

_Copyright_: **NIRAS A/S and Casper Fibaek**

_License_: **Undisclosed**

# File descriptions

### **commands.ts**

Holds all of the custom command line commands available inside of excel. Controls
Mainly used to control the button presses in the top pane.

### **custom_functions.ts**

All of the custom functions available inside of excel such as satf.demography. Most
of these functions send the request directly to the satf API.

### **custom_functions_meta.json**

This is the metadata shown inside excel for each function. This needs to map 1-to-1 to
the custom_functions.ts file. If there is a mismatch it will fail to compile.

### **app.tsx**

This is the main entrance point for the interface application. It runs react and page
navigation is handled through the react router.

### **manifest.ejs**

The template for the manifest files, which are the main entry points from Excel. Load
the proper manifest file to load the interface into Excel.

# Installation

Steps for installation:
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

# Building:

1. Run npm run build
2. In VSC: Right click "dist" folder at upload the interface to satf_static @ azure

PROD is at https://satfstatic.z6.web.core.windows.net/?page=map
DEV is at https://satfstaticdev.z6.web.core.windows.net/?page=map
