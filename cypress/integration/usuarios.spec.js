/// <reference types="cypress" />

import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

    it('Deve validar contrato de usuarios', () => {
        cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
        })
    });

    it('Deve listar usuários cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'usuarios'
        }).then((response) => {
            //expect(response.body.usuarios[0].nome).to.equal('Fulano da Silva')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            expect(response.duration).to.be.lessThan(20)
        })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
        let name = `User ${Math.floor(Math.random() * 100000000)}`
        let email = `Email${Math.floor(Math.random() * 100000000)}@qa.com`
        let password = `Password ${Math.floor(Math.random() * 100000000)}`
        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": name,
                "email": email,
                "password": password,
                "administrador": "true"
            },
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })

    });

    it('Deve validar um usuário com email inválido', () => {
        //TODO: 
    });

    it('Deve validar um usuário com email inválido', () => {
        const invalidEmail = 'emailinvalido';

        cy.request({
            method: 'POST',
            url: '/usuarios',
            body: {
                "nome": "Fulano da Silva",
                "email": invalidEmail,
                "password": "teste",
                "administrador": "true"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.email).to.equal('email deve ser um email válido');
        });
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        let nome = `User ${Math.floor(Math.random() * 100000000)}`
        let email = `Email${Math.floor(Math.random() * 100000000)}@qa.com`
        let password = `Password ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarUsuario(nome, email, password, "true")
            .then(response => {
                let id = response.body._id

                cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body:
                    {
                        "nome": nome,
                        "email": email,
                        "password": password,
                        "administrador": "true"
                    }

                }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
                })
            })

    });

    it('Deve deletar um usuário previamente cadastrado', () => {
        let nome = `User ${Math.floor(Math.random() * 100000000)}`
        let email = `Email${Math.floor(Math.random() * 100000000)}@qa.com`
        let password = `Password ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarUsuario(nome, email, password, "true")
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
                }).then(response =>{
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
                })
            })

    });


});