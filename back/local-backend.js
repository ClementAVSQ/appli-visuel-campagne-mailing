const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const csv = require("csv-parser");
const parseCsvToObject = require("./setting_data_csv.js");

function getCsvRoot(dataRoot) {
  return path.join(dataRoot, "fichier_csv");
}

function ensureFolders(dataRoot) {
  const csvRoot = getCsvRoot(dataRoot);
  const folders = [csvRoot, path.join(csvRoot, "data_by_link")];

  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
}

async function saveCsv({ dataRoot, idCampaign, fileBuffer, isLink }) {
  if (!idCampaign) {
    throw new Error("id_campaign is required");
  }

  const csvRoot = getCsvRoot(dataRoot);
  const targetDir = isLink ? path.join(csvRoot, "data_by_link") : csvRoot;
  await fsp.mkdir(targetDir, { recursive: true });

  const filename = `${idCampaign}.csv`;
  const filePath = path.join(targetDir, filename);
  await fsp.writeFile(filePath, fileBuffer);

  return { success: true, filename, path: filePath };
}

async function getCampaignData({ dataRoot, idCampaign }) {
  if (!idCampaign) {
    return { success: false, info: "id_campaign is required" };
  }

  const csvRoot = getCsvRoot(dataRoot);
  const filePath = path.join(csvRoot, `${idCampaign}.csv`);

  try {
    await fsp.access(filePath);
  } catch (err) {
    return {
      success: false,
      info: `No file found for ${idCampaign}`
    };
  }

  const data = await parseCsvToObject(filePath);
  return { success: true, file: data };
}

function getLinkData({ dataRoot, idCampaign }) {
  if (!idCampaign) {
    return Promise.resolve({ success: false, error: "id_campaign is required" });
  }

  const filePath = path.join(
    getCsvRoot(dataRoot),
    "data_by_link",
    `${idCampaign}.csv`
  );

  if (!fs.existsSync(filePath)) {
    return Promise.resolve({ success: false, error: "file not found", data: [] });
  }

  return new Promise((resolve, reject) => {
    const results = {};

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ";" }))
      .on("headers", (headers) => {
        const links = headers.filter(
          (h) =>
            h.startsWith("http://") ||
            h.startsWith("https://") ||
            h.startsWith("mailto:")
        );
        links.forEach((link) => {
          results[link] = [];
        });
      })
      .on("data", (row) => {
        Object.keys(results).forEach((link) => {
          const value = row[link] && String(row[link]).trim();
          if (value) {
            const emailKey = Object.keys(row).find((key) =>
              key.trim().toLowerCase().includes("mail")
            );
            if (emailKey) {
              const email = row[emailKey] && String(row[emailKey]).trim();
              if (email && email.includes("@")) {
                results[link].push(email);
              }
            }
          }
        });
      })
      .on("end", () => {
        const responseData = Object.keys(results).map((link) => ({
          link,
          list_mail: results[link]
        }));
        resolve({ success: true, data: responseData });
      })
  });
}

async function deleteCampaignCsv({ dataRoot, idCampaign }) {
  if (!idCampaign) {
    return { success: false, info: "id_campaign is required" };
  }

  const csvRoot = getCsvRoot(dataRoot);
  const filePath = path.join(csvRoot, `${idCampaign}.csv`);

  try {
    await fsp.access(filePath);
    await fsp.unlink(filePath);
    return { success: true, info: `File ${idCampaign}.csv deleted successfully` };
  } catch (err) {
    return { success: false, info: `File ${idCampaign}.csv not found or could not be deleted` };
  }
}

async function deleteLinkCsv({ dataRoot, idCampaign }) {
  if (!idCampaign) {
    return { success: false, info: "id_campaign is required" };
  }

  const csvRoot = getCsvRoot(dataRoot);
  const filePath = path.join(csvRoot, "data_by_link", `${idCampaign}.csv`);

  try {
    await fsp.access(filePath);
    await fsp.unlink(filePath);
    return { success: true, info: `Link file ${idCampaign}.csv deleted successfully` };
  } catch (err) {
    return { success: false, info: `Link file ${idCampaign}.csv not found or could not be deleted` };
  }
}

module.exports = {
  ensureFolders,
  saveCsv,
  getCampaignData,
  getLinkData,
  deleteCampaignCsv,
  deleteLinkCsv
};
