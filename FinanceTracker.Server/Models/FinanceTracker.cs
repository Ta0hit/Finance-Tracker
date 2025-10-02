namespace FinanceTracker.Server.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public TransactionType Type { get; set; } // Income or Expense
        public string? Notes { get; set; }
    }

    public enum TransactionType
    {
        Income,
        Expense
    }
}