import React from 'react';
import { mount } from 'cypress-react-unit-test';
import '../../src/index.css';
import App from '../../src/App';
import {store, configureFakeBackend} from "../../src/_helpers";
import {Provider} from "react-redux";
configureFakeBackend();
const typeOptions = { delay: 100 };

describe('App', () => {
  it('renders learn react link', () => {
    mount(<Provider store={store}><App /></Provider>,{
      stylesheets: [
        'https://netdna.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
      ]
    });
    // use standard Cypress commands
    // cy.contains('Login').should('be.visible');
    // cy.visit('/register');

    // cy.get('input[name=username]').type('mohammad');
    cy.get('#go-register').click().should(() => {});
    cy.get('input[name=firstName]').type('mohammad',typeOptions);
    cy.get('input[name=lastName]').type('joud',typeOptions);
    cy.get('input[name=username]').type('mohammadJD',typeOptions);
    cy.get('input[name=password]').type('moh12345',typeOptions);

    cy.get('#submit-register').click();
    cy.wait(3000);

    cy.contains('Login').should('be.visible');
    //wrong case
    cy.get('input[name=username]').type('wrong user name',typeOptions);
    cy.get('input[name=password]').type('moh12345',typeOptions);

    cy.get('#submit-login').click().should(() => {
    });
    cy.wait(3000);

    //correct case case

    cy.get('input[name=username]').clear();
    cy.get('input[name=password]').clear();

    cy.get('input[name=username]').type('mohammadJD',typeOptions);
    cy.get('input[name=password]').type('moh12345',typeOptions);

    cy.get('#submit-login').click().should(() => {
    })

    // cy.get('#submit-login').click().should(() => {
    //   expect(localStorage.getItem('users'))
    // })
  });
});
