import React, { useEffect, useState } from 'react';
import '../App.css';
import { Contact, addContact, getAllContacts, transformResponse } from './../services/phonebookService';
import { Button, List, ListItem, ListItemText, TextField, Typography, styled } from '@mui/material';

const App: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('+46');
    const [phonebook, setPhonebook] = useState<Contact[]>([]);

    const [nameError, setNameError] = useState<string | null>(null);
    const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);

    useEffect(() => {
        fetchContacts();
    }, [])

    const fetchContacts = async () => {
        const response = await getAllContacts();
        const transformedData = transformResponse(response);
        setPhonebook(transformedData);
    }

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPhoneNumber = event.target.value;
        setPhoneNumber(newPhoneNumber);
    
        if (!newPhoneNumber.trim()) {
            setPhoneNumberError('Telefonnummer är obligatoriskt');
        } else if (!/^\+?\d*$/.test(newPhoneNumber)) {
            setPhoneNumberError('Ogiltigt telefonnummer');
        } else {
            setPhoneNumberError('');
        }
    };
    

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        setName(newName);
    
        if (!newName.trim()) {
            setNameError('Name är obligatoriskt');
        } else {
            setNameError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newContact: Contact = {
            Id: 1,
            Name: name,
            Phonenumber: phoneNumber
        };

        try {
            await addContact(newContact)
            setName('');
            setPhoneNumber('');
            fetchContacts();
        } catch (error) {
            console.error('Error adding contact', error)
        }
    };

    const StyledListItem = styled(ListItem)(({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        '&:hover': {
            boxShadow: theme.shadows[1],
        },
    })); 

    return (
    <div className="app-container">
        <h1>Lägg till en ny kontakt</h1>
        <form onSubmit={handleSubmit} className="form-container">
            <TextField
                id="name"
                label="Namn"
                value={name}
                onChange={handleNameChange}
                error={!!nameError}
                helperText={nameError}
            />
            <TextField
                id="phoneNumber"
                label="Telefonnummer"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                error={!!phoneNumberError}
                helperText={phoneNumberError}
            />
            <Button variant="contained" type="submit">Lägg till i telefonboken</Button>
        </form>
        <Typography variant="h2" sx={{ marginBottom: 2 }}>Telefonbok</Typography>
            <List>
                {phonebook.map(contact => (
                    <StyledListItem key={contact.Id} disablePadding>
                        <ListItemText
                            primary={contact.Name}
                            secondary={contact.Phonenumber}
                            primaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                            secondaryTypographyProps={{ variant: 'body1', color: 'text.secondary' }}
                        />
                    </StyledListItem>
                ))}
            </List>
    </div>
    );
}

export default App;
