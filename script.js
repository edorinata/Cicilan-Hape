function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

function setTotalAmount() {
  const totalAmountInput = document.getElementById('totalAmount');
  const parsedAmount = parseFloat(totalAmountInput.value);

  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    alert('Masukkan jumlah yang valid.');
    return;
  }

  localStorage.setItem('totalAmount', parsedAmount);
  updatePaymentList();
}

function addPayment() {
  const amountInput = document.getElementById('amount');
  const amount = amountInput.value;

  if (amount.trim() === '' || isNaN(amount) || amount <= 0) {
    alert('Masukkan jumlah pembayaran yang valid.');
    return;
  }

  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  const payment = {
    amount: parseFloat(amount),
    date: formattedDate
  };

  let payments = JSON.parse(localStorage.getItem('payments')) || [];
  payments.push(payment);
  localStorage.setItem('payments', JSON.stringify(payments));

  updatePaymentList();
  amountInput.value = '';
}

function removePayment(index) {
  let payments = JSON.parse(localStorage.getItem('payments')) || [];
  payments.splice(index, 1);
  localStorage.setItem('payments', JSON.stringify(payments));
  updatePaymentList();
}

function updatePaymentList() {
  const paymentList = document.getElementById('paymentList');
  paymentList.innerHTML = '';

  const payments = JSON.parse(localStorage.getItem('payments')) || [];
  const totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;

  payments.forEach((payment, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('payment-item'); // Menambahkan kelas untuk mengatur tata letak
    listItem.innerHTML = `${payment.date} <span class="paymentamount">${formatCurrency(payment.amount)}</span>`;
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus';
    deleteButton.onclick = () => removePayment(index);

    listItem.appendChild(deleteButton);
    paymentList.appendChild(listItem);
});

  const totalDisplay = document.getElementById('totalDisplay');
  totalDisplay.textContent = `Total Cicilan: ${formatCurrency(totalAmount)}`;

  const remainingDisplay = document.getElementById('remainingDisplay');
  const remainingAmount = totalAmount - payments.reduce((sum, payment) => sum + payment.amount, 0);
  remainingDisplay.textContent = `Sisa Pembayaran: ${formatCurrency(remainingAmount)}`;
}

window.onload = function() {
  updatePaymentList();
};