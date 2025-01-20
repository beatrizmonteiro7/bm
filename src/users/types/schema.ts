import { z } from 'zod';

export const schema = z.object({
  id: z.number().nullable().default(null),
  cnpj: z.object({
    value: z.string().length(14, { message: 'CNPJ deve ter 14 dígitos' }).nonempty({ message: 'CNPJ obrigatório' }),
    error: z.boolean().default(false)
  }),
  nome: z.string().min(1, { message: 'Nome obrigatório' }),
  nomeFantasia: z.string().min(1, { message: 'Nome Fantasia obrigatório' }),
  cep: z.object({
    value: z.string().length(9, { message: 'CEP obrigatório' }).nonempty({ message: 'CEP obrigatório' }),
    error: z.boolean().default(false)
  }),
  logradouro: z.string().min(1, { message: 'Logradouro obrigatório' }),
  bairro: z.string().min(1, { message: 'Bairro obrigatório' }),
  cidade: z.string().min(1, { message: 'Cidade obrigatória' }),
  uf: z.string().length(2, { message: 'UF obrigatória' }),
  complemento: z.string().nullable(),
  email: z.string().email({ message: 'Email inválido' }).nonempty({ message: 'Email obrigatório' }),
  telefone: z.string().min(1, { message: 'Telefone obrigatório' })
});
