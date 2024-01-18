let targetAmount = parseFloat(localStorage.getItem('targetAmount')) || 0;

function addPayment() {
  const amountInput = document.getElementById('amount');
  const paymentList = document.getElementById('paymentList');
  const totalAmountElement = document.getElementById('totalAmount');
  const remainingAmountElement = document.getElementById('remainingAmount');

  if (amountInput.value !== '') {
    const amount = parseFloat(amountInput.value);
    const date = new Date().toLocaleDateString('id-ID');

    const listItem = document.createElement('li');
    listItem.innerHTML = `<div><p><strong>Pembayaran:</strong> Rp ${new Intl.NumberFormat('id-ID').format(amount)}</p><p>${date}</p></div><button onclick="removePayment(this)">Hapus</button>`;
    
    paymentList.appendChild(listItem);
    updateLocalStorage();
    updateTotals();
    amountInput.value = '';
  } else {
    alert('Masukkan jumlah pembayaran.');
  }
}

function updateLocalStorage() {
  const paymentList = document.getElementById('paymentList');
  const payments = [];
  for (const listItem of paymentList.children) {
    const paymentData = {
      amount: parseFloat(listItem.querySelector('p:first-child').textContent.match(/Rp (\d+\.\d+)/)[1].replace('.', '')),
      date: listItem.querySelector('p:last-child').textContent
    };
    payments.push(paymentData);
  }
  localStorage.setItem('payments', JSON.stringify(payments));
}

function loadFromLocalStorage() {
  const paymentList = document.getElementById('paymentList');
  const payments = JSON.parse(localStorage.getItem('payments')) || [];

  for (const paymentData of payments) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<div><p><strong>Pembayaran:</strong> Rp ${new Intl.NumberFormat('id-ID').format(paymentData.amount)}</p><p>${paymentData.date}</p></div><button onclick="removePayment(this)">Hapus</button>`;
    
    paymentList.appendChild(listItem);
  }
  updateTotals();
}

function removePayment(button) {
  if (confirm('Anda yakin ingin menghapus pembayaran ini?')) {
    const listItem = button.parentNode;
    listItem.remove();
    updateLocalStorage();
    updateTotals();
  }
}

function updateTotals() {
  const totalAmountElement = document.getElementById('totalAmount');
  const remainingAmountElement = document.getElementById('remainingAmount');
  const targetAmountElement = document.getElementById('targetAmountDisplay');

  const paymentList = document.getElementById('paymentList');

  let totalAmount = 0;
  for (const listItem of paymentList.children) {
    const amount = parseFloat(listItem.querySelector('p:first-child').textContent.match(/Rp (\d+\.\d+)/)[1].replace('.', ''));
    totalAmount += amount;
  }

  totalAmountElement.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(totalAmount)}`;

  const remainingAmount = targetAmount - totalAmount;
  remainingAmountElement.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(remainingAmount)}`;
}

function setTarget() {
  const targetInput = document.getElementById('targetAmount');
  const targetAmountElement = document.getElementById('targetAmountDisplay');

  if (targetInput.value !== '') {
    targetAmount = parseFloat(targetInput.value.replace('.', ''));
    targetAmountElement.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(targetAmount)}`;
    updateTotals();
    
    // Tambahkan baris berikut untuk menyimpan nilai targetAmount di localStorage
    localStorage.setItem('targetAmount', targetAmount.toString());
    
    // Tambahkan baris berikut untuk mengosongkan kotak input
    targetInput.value = '';
  } else {
    alert('Masukkan jumlah target cicilan.');
  }
}

loadFromLocalStorage();