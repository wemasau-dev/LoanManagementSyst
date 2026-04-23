// Frontend JavaScript for your loan portal
class LoanPortal {
  constructor(googleScriptUrl) {
    this.apiUrl = googleScriptUrl;
  }

  async createLoan(amount, startDate) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createLoan',
        amount: amount,
        startDate: startDate,
        rate: this.calculateRate(amount),
        totalPayable: this.calculateTotalPayable(amount)
      })
    });
    
    return await response.json();
  }

  calculateRate(amount) {
    if (amount <= 151000) return 0.0020;
    if (amount <= 251000) return 0.0021;
    if (amount <= 401000) return 0.0022;
    if (amount <= 601000) return 0.0023;
    if (amount <= 801000) return 0.0024;
    if (amount <= 1001000) return 0.0025;
    if (amount <= 1501000) return 0.0026;
    if (amount <= 2001000) return 0.0027;
    if (amount <= 2501000) return 0.0028;
    return 0.0029;
  }

  calculateTotalPayable(amount) {
    const rate = this.calculateRate(amount);
    return amount + (amount * rate);
  }

  async makePayment(loanId, amount, paymentDate) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'makePayment',
        loanId: loanId,
        amount: amount,
        paymentDate: paymentDate
      })
    });
    
    return await response.json();
  }

  async getLoans() {
    const response = await fetch(`${this.apiUrl}?action=getLoans`);
    return await response.json();
  }

  async getLoan(loanId) {
    const response = await fetch(`${this.apiUrl}?action=getLoan&id=${loanId}`);
    return await response.json();
  }

  displayLoanSummary(loan) {
    const html = `
      <div class="loan-summary">
        <h3>Loan ${loan.id}</h3>
        <p>Amount: $${loan.amount.toLocaleString()}</p>
        <p>Rate: ${(loan.rate * 100).toFixed(1)}%</p>
        <p>Total Payable: $${loan.totalPayable.toLocaleString()}</p>
        <p>Status: ${loan.status}</p>
        
        <h4>Instalments</h4>
        <table class="instalments-table">
          <thead>
            <tr><th>#</th><th>Due Date</th><th>Amount</th><th>Status</th><th>Paid</th></tr>
          </thead>
          <tbody>
            ${loan.instalments.map(inst => `
              <tr class="${inst.status}">
                <td>${inst.number}</td>
                <td>${new Date(inst.dueDate).toLocaleDateString()}</td>
                <td>$${inst.amount.toLocaleString()}</td>
                <td>${inst.status}</td>
                <td>$${inst.paidAmount.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    document.getElementById('loan-details').innerHTML = html;
  }
}

// Initialize portal
const portal = new LoanPortal('YOUR_GOOGLE_SCRIPT_URL');
