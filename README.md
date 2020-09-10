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

Copyright: NIRAS A/S
License: Undisclosed