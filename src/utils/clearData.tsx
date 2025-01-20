export default function clearData(data: any) {
    return data.map(item => {
        if (item.cnpj && item.cnpj.value) {
            item.cnpj = item.cnpj.value
        }

        if (item.cep && item.cep.value) {
            item.cep = item.cep.value
        }

        return item;
    })
}