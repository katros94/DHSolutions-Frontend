import axios from "axios";

const API_URL = 'https://localhost:7222/api/Contacts';

export interface Contact {
    Id?: number,
    Name: string,
    Phonenumber: string
}

export const transformResponse = (response: any[]): Contact[] => {
    return response.map((contact: any) => {
        return {
            Id: contact.id,
            Name: contact.name,
            Phonenumber: contact.phonenumber
        };
    });
};

export const addContact = async (contact: Contact) => {
    try {

        const response = await axios.post(API_URL, contact, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
        } catch (error) {
        console.error('Error adding contact:', error);
        throw error;
    }
}

export const getAllContacts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error get all contacts', error);
        throw error;
    }
}