import axiosClient from "./axiosClient";

const unwrap = (response) =>
  response.data && Object.prototype.hasOwnProperty.call(response.data, "data")
    ? response.data.data
    : response.data;

const voteHeaders = (voteToken) => ({
  headers: { Authorization: `Bearer ${voteToken}` },
  skipAuthRefresh: true,
});

const ddayVoteAPI = {
  getConfig: async () => unwrap(await axiosClient.get("/vote/dday")),

  createSession: async (accessToken) =>
    unwrap(
      await axiosClient.post(
        "/vote/dday/session",
        { accessToken },
        { skipAuthRefresh: true },
      ),
    ),

  getStatus: async (voteToken) =>
    unwrap(await axiosClient.get("/vote/dday/status", voteHeaders(voteToken))),

  submitBallot: async (voteToken, payload) =>
    unwrap(
      await axiosClient.post(
        "/vote/dday/ballots",
        payload,
        voteHeaders(voteToken),
      ),
    ),

  getResults: async () => unwrap(await axiosClient.get("/vote/dday/results")),

  getAdminConfig: async () =>
    unwrap(await axiosClient.get("/admin/vote/dday")),

  updateAdminConfig: async (payload) =>
    unwrap(await axiosClient.patch("/admin/vote/dday", payload)),

  open: async (payload = {}) => unwrap(await axiosClient.post("/admin/vote/dday/open", payload)),

  updateCloseTime: async (closeAt) => unwrap(await axiosClient.patch("/admin/vote/dday/close-time", { closeAt })),

  close: async () => unwrap(await axiosClient.post("/admin/vote/dday/close")),

  getAudit: async (params = {}) => {
    const response = await axiosClient.get("/admin/vote/dday/audit", { params });
    return response.data;
  },
};

export default ddayVoteAPI;
