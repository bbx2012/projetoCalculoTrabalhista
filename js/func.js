document.addEventListener('DOMContentLoaded', function() {
    const calcularBtn = document.getElementById('calcularBtn');
    const limparBtn = document.getElementById('limparBtn');
    
    calcularBtn.addEventListener('click', calcularTrabalhista);
    limparBtn.addEventListener('click', limparCampos);
    
    document.getElementById('valorHora').addEventListener('change', function() {
        if (parseFloat(this.value) === 0) {
            alert('Sistema encerrado conforme solicitado (valor da hora = 0)');
            
        }
    });
});

function calcularTrabalhista() {
    
    const valorHora = parseFloat(document.getElementById('valorHora').value);
    const horasTrabalhadas = parseFloat(document.getElementById('horasTrabalhadas').value);
    const valeTransporte = document.querySelector('input[name="valeTransporte"]:checked').value === 'S';
    const outrasDeducoes = parseFloat(document.getElementById('outrasDeducoes').value) || 0;
    
   
    if (isNaN(valorHora) || isNaN(horasTrabalhadas)) {
        alert('Por favor, preencha o valor da hora e a quantidade de horas trabalhadas.');
        return;
    }
    
    
    const salarioBruto = valorHora * horasTrabalhadas;
    

    const inss = calcularINSS(salarioBruto);
   
    const irpf = calcularIRPF(salarioBruto - inss); 
    
   
    const vt = valeTransporte ? salarioBruto * 0.06 : 0;
    

    const salarioLiquido = salarioBruto - inss - irpf - vt - outrasDeducoes;
    
   
    document.getElementById('salarioBruto').textContent = formatarMoeda(salarioBruto);
    document.getElementById('inss').textContent = `- ${formatarMoeda(inss)}`;
    document.getElementById('irpf').textContent = `- ${formatarMoeda(irpf)}`;
    document.getElementById('valeTransporte').textContent = `- ${formatarMoeda(vt)}`;
    document.getElementById('outrasDeducoesResult').textContent = `- ${formatarMoeda(outrasDeducoes)}`;
    document.getElementById('salarioLiquido').textContent = formatarMoeda(salarioLiquido);
}

function calcularINSS(salario) {
   
    const faixasINSS = [
        { min: 0, max: 1320, aliquota: 0.075 },
        { min: 1320.01, max: 2571.29, aliquota: 0.09 },
        { min: 2571.30, max: 3856.94, aliquota: 0.12 },
        { min: 3856.95, max: 7507.49, aliquota: 0.14 }
    ];
    
    let inss = 0;
    
    for (const faixa of faixasINSS) {
        if (salario > faixa.min) {
            const baseCalculo = Math.min(salario, faixa.max) - faixa.min;
            inss += baseCalculo * faixa.aliquota;
        } else {
            break;
        }
    }
    
    return inss;
}

function calcularIRPF(baseCalculo) {
    
    if (baseCalculo <= 2112.00) return 0;
    if (baseCalculo <= 2826.65) return baseCalculo * 0.075 - 158.40;
    if (baseCalculo <= 3751.05) return baseCalculo * 0.15 - 370.40;
    if (baseCalculo <= 4664.68) return baseCalculo * 0.225 - 651.73;
    return baseCalculo * 0.275 - 884.96;
}

function formatarMoeda(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
}

function limparCampos() {
    document.getElementById('valorHora').value = '';
    document.getElementById('horasTrabalhadas').value = '';
    document.getElementById('vtSim').checked = true;
    document.getElementById('outrasDeducoes').value = '0';
    
   
    document.getElementById('salarioBruto').textContent = 'R$ 0,00';
    document.getElementById('inss').textContent = '- R$ 0,00';
    document.getElementById('irpf').textContent = '- R$ 0,00';
    document.getElementById('valeTransporte').textContent = '- R$ 0,00';
    document.getElementById('outrasDeducoesResult').textContent = '- R$ 0,00';
    document.getElementById('salarioLiquido').textContent = 'R$ 0,00';
}