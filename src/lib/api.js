import axios from 'axios';

export async function FetchedImage(query  ="trumpet") {
    try {
        // Data to be sent in the request body
        const data = {
            description: query
        };

        // Make a POST request
        const response = await axios.post('http://192.168.0.129:8081/searchstring', data);
        console.log(response.data.data[0].url); // Assuming the response has a URL property
        return response.data.data[0].url;
    } catch (error) {
        console.error("Failed to fetch image:", error);
        return null; // Handle error appropriately
    }
}
