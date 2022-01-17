import React from 'react'; // eslint-disable-line
import {
  Text, Stack, Separator, Link,
} from '@fluentui/react';

function Install(): any {
  document.title = 'SatF Tool - Install';

  return (
    <Stack id="home_body">
      <Text variant="xLarge" block className="home_text">
        Installing the SatF Tool
      </Text>
      <Separator />
      <Text variant="mediumPlus" block className="home_text_base">
          Download the SatF tool here: {<Link download href="https://satfstatic.z6.web.core.windows.net/satf_production.0.4.6.xml">Production</Link>} | {<Link download href="https://satfstaticdev.z6.web.core.windows.net/satf_development.0.4.6.xml">Development</Link>}
      </Text>
      <div className="guide">
        <Text variant="mediumPlus" block className="guide_text">Installation Guide: (WEB)</Text>
        <Text variant="medium" block className="guide_text_body">
            1. Go to <Link href="https://excel.office.com/">excel.office.com</Link> and log into your Microsoft account.
        </Text>
        <Text variant="medium" block className="guide_text_body">
            2. Open a workbook or create a new empty one.
        </Text>
        <Text variant="medium" block className="guide_text_body">
            3. In excel, go to Insert, go to "Get Add Ins", at the top go to “Upload my add in”, upload the downloaded xml file from the downloads folder.
        </Text>
        <Text variant="medium" block className="guide_text_body">
            4. Now you have the SATF ribbon ready to analyse data!
        </Text>
        <Text variant="medium" block className="guide_text_body">
            5. In case Windows is giving you security warnings: Open Internet Options {'-->'} Security {'-->'} Trusted Sites and add "https://*.satf.azurewebsites.net" {'&'} "https://*.satf-test.azurewebsites.net".
        </Text>
      </div>
      <div className="guide">
        <Text variant="mediumPlus" block className="guide_text">Installation Guide: (DESKTOP)</Text>
        <Text variant="medium" block className="guide_text_body">
            1. Create a new folder on your computer in a place you'll remember.
        </Text>
        <Text variant="medium" block className="guide_text_body">
            2. Right-click the newly generated folder and choose properties {'-->'} sharing {'-->'} advanced sharing and share the folder and enable all permissions. Copy the network path
        </Text>
        <Text variant="medium" block className="guide_text_body">
            3. Open excel and choose options in the bottom left {'-->'} trust center {'-->'} trust center settings {'-->'} trusted add-in catalogs {'-->'} paste the network url from step 2. Enable "show in menu". Click okay and restart excel.
        </Text>
        <Text variant="medium" block className="guide_text_body">
            4. Reopen excel and choose insert {'-->'} my add-ins {'-->'} shared folder {'-->'} start the satf addin
        </Text>
        <Text variant="medium" block className="guide_text_body">
            5. Now you have the SATF ribbon ready to analyse data!
        </Text>
      </div>
    </Stack>
  );
}

export default Install;
