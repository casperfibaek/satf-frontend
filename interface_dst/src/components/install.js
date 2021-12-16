import React from 'react'; // eslint-disable-line
import { Text, Stack, Separator, Link, } from '@fluentui/react';
function Install() {
    document.title = 'SatF Tool - Install';
    return (React.createElement(Stack, { id: "home_body" },
        React.createElement(Text, { variant: "xLarge", block: true, className: "home_text" }, "Installing the SatF Tool"),
        React.createElement(Separator, null),
        React.createElement(Text, { variant: "mediumPlus", block: true, className: "home_text_base" },
            "Download the SatF tool here: ",
            React.createElement(Link, { download: true, href: "https://satfstatic.z6.web.core.windows.net/satf_production.0.4.6.xml" }, "Production"),
            " | ",
            React.createElement(Link, { download: true, href: "https://satfstatic.z6.web.core.windows.net/satf_development.0.4.6.xml" }, "Development")),
        React.createElement("div", { className: "guide" },
            React.createElement(Text, { variant: "mediumPlus", block: true, className: "guide_text" }, "Installation Guide: (WEB)"),
            React.createElement(Text, { variant: "medium", block: true, className: "guide_text_body" },
                "1. Go to ",
                React.createElement(Link, { href: "https://excel.office.com/" }, "excel.office.com"),
                " and log into your Microsoft account."),
            React.createElement(Text, { variant: "medium", block: true, className: "guide_text_body" }, "2. Open a workbook or create a new empty one."),
            React.createElement(Text, { variant: "medium", block: true, className: "guide_text_body" }, "3. In excel, go to Insert, go to \"Get Add Ins\", at the top go to \u201CUpload my add in\u201D, upload the downloaded xml file from the downloads folder."),
            React.createElement(Text, { variant: "medium", block: true, className: "guide_text_body" }, "4. Now you have the SATF ribbon ready to analyse data!"),
            React.createElement(Text, { variant: "medium", block: true, className: "guide_text_body" },
                "5. In case Windows is giving you security warnings: Open Internet Options ",
                '-->',
                " Security ",
                '-->',
                " Trusted Sites and add \"https://*.satf.azurewebsites.net\" ",
                '&',
                " \"https://*.satf-test.azurewebsites.net\".")),
        React.createElement("div", { className: "guide" },
            React.createElement(Text, { variant: "mediumPlus", block: true, className: "guide_text" }, "Installation Guide: (DESKTOP)"),
            React.createElement(Text, { variant: "medium", block: true, className: "guide_text_body" }, "1. Create a new folder on your computer in a place you'll remember."),
            React.createElement(Text, { variant: "medium", block: true, className: "guide_text_body" }, "2. Right-click the newly generated folder and choose properties -> sharing -> advanced sharing and share the folder and enable all permissions. Copy the network path"),
            React.createElement(Text, { variant: "medium", block: true, className: "guide_text_body" }, "3. Open excel and choose options in the bottom left -> trust center -> trust center settings -> trusted add-in catalogs -> paste the network url from step 2. Enable \"show in menu\". Click okay and restart excel."),
            React.createElement(Text, { variant: "medium", block: true, className: "guide_text_body" }, "4. Reopen excel and choose insert -> my add-ins -> shared folder -> start the satf addin"),
            React.createElement(Text, { variant: "medium", block: true, className: "guide_text_body" }, "5. Now you have the SATF ribbon ready to analyse data!"))));
}
export default Install;
//# sourceMappingURL=install.js.map