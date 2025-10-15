import axios from "axios";
import { baseUrl } from "../config";

const listAllHalloween = async () => {
    try {
        const response = await axios.get(`${baseUrl}/api/halloweens`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const updateReptile = async (reptileId, reptileData, token) => {
    try {
        console.log("Updating reptile with ID:", reptileId);
        const response = await axios.put(`${baseUrl}/reptitist/info/update-reptile/${reptileId}`, reptileData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const halloweensApi = {
    listAllHalloween,
}
export default halloweensApi;