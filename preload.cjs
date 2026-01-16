const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  uploadCsv: ({ idCampaign, fileData }) =>
    ipcRenderer.invoke("csv:upload", { idCampaign, fileData }),
  uploadLinkCsv: ({ idCampaign, fileData }) =>
    ipcRenderer.invoke("csv:uploadLink", { idCampaign, fileData }),
  getCampaignData: (idCampaign) =>
    ipcRenderer.invoke("csv:data", { idCampaign }),
  getLinkData: (idCampaign) => ipcRenderer.invoke("csv:links", { idCampaign }),
  deleteCampaignCsv: (idCampaign) => ipcRenderer.invoke("csv:deleteCampaign", { idCampaign }),
  deleteMailCsv: (idCampaign) => ipcRenderer.invoke("csv:deleteLink", { idCampaign })
});
