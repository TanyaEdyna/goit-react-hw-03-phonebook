import React, { Component } from "react";
import { ContactForm } from "./ContactForm/ContactForm";
import Filter from "./Filter/Filter";
import ContactList from "./ContactList/ContactList";
import toContacts from "../components/contacts.json"
import css from "./App.module.css";
import { nanoid } from "nanoid";

export class App extends Component { 
  state = {
    contacts: toContacts,
    filter: "",
  };

  handleFormSubmit = ({ name, number }) => {//  дані про контакт це об'єкт з властивостями name i number
    const newContact = { name, number, id: nanoid() };//Створюється новий контакт, який містить ім'я, номер, id
    const { contacts } = this.state;

    if (contacts.some((contact) => name === contact.name)) {//перевірка
      alert(`${name} is already in contacts`);
      return;
    }

    this.setState(({ contacts }) => ({//setState оновлює стан контакту і додає нові
      contacts: [...contacts, newContact],
    }));

  };

  handleChangeFilter = (event) => {
    this.setState({ filter: event.target.value });//змінює значення вл-ті filter(event.target.value  - те що вводить користувач в полі)
    console.log(event.target.value)
  };

  deleteContact = (id) => {
    this.setState((prevState) => ({
      contacts: prevState.contacts.filter((contact) => contact.id !== id), //створюється новий масив контактів де видалені контакти с певними id
    }));
  };
  getFilteredContacts = (contacts, filter) => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };
  
  componentDidMount() {//Під час додавання та видалення контакту контакти зберігаються у локальне сховище.
    const getContactsStorage = localStorage.getItem('contacts');
    if (getContactsStorage) {
      console.log("ContactsStorage", getContactsStorage);
      this.setState({contacts: JSON.parse(getContactsStorage)})
    }
    console.log("didMount:")
  }
  componentDidUpdate() {//збереження нових контактів
    const { contacts } = this.state;
    console.log(contacts)
    localStorage.setItem('contacts', JSON.stringify(contacts));

  
  }
  

  render() {
    const { contacts, filter} = this.state;
    return (
      <div className={css.form_block}>
        <h1 className={css.title}>Phonebook</h1>
        <ContactForm
          onSubmit={this.handleFormSubmit}
          contacts={contacts} />
        <h2>Contacts</h2>
        <Filter
          filter={filter}
          onChange={this.handleChangeFilter} />
        <ContactList
          contacts={this.getFilteredContacts(contacts, filter)}
          deleteContact={this.deleteContact} />
      </div>
    );
  }
}
