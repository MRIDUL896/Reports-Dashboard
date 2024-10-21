import axios from 'axios';

export const fetchInterviews = async () => {
    try {
        const response = await axios.get("https://api.althire.ai/assignment/fullstack01");
        return response.data; // Axios automatically parses the JSON response
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Rethrow the error for further handling
    }
};
