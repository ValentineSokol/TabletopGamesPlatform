import React from 'react';
import styled from 'styled-components';

const Form = styled.form`
  background: black;
  width: 60%;
  margin: 5% auto;
  padding: 1% 0;
  border-radius: 10px;
  color: white;
`;
const Input = styled.input`
  outline: none;
  margin-left: 1%;
  margin-right: 5%;
`;
const Button = styled.button`
`;

function Login() {
  return (
   <Form>
    <h3>Створити обліковий запис:</h3>
    <label>
        Ім&apos;я користувача:
        <Input />
    </label>
    <label>
        Пароль:
        <Input type="password" />
    </label>
    <Button type="submit">Готово</Button>
   </Form>
  );
}

export default Login;
