using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinanceTracker.Server.Data;
using FinanceTracker.Server.Models;

namespace FinanceTracker.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransactionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: get all transactions by date
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            return await _context.Transactions.OrderByDescending(t => t.Date).ToListAsync();
        }

        // GET: get transactions ordered by amount
        [HttpGet("ordered-by-amount")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsOrderedByAmount(
            [FromQuery] string order = "desc")
        {
            var query = _context.Transactions.AsQueryable();

            if (order.ToLower() == "asc")
            {
                query = query.OrderBy(t => t.Amount).ThenByDescending(t => t.Date);
            }
            else
            {
                query = query.OrderByDescending(t => t.Amount).ThenByDescending(t => t.Date);
            }

            var transactions = await query.ToListAsync();
            return transactions;
        }

        // GET: get transactions by specified amount
        [HttpGet("by-exact-amount/{amount}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByAmount(decimal amount)
        {
            var transactions = await _context.Transactions
                .Where(t => t.Amount == amount)
                .OrderByDescending(t => t.Date)
                .ToListAsync();

            return transactions;
        }

        // GET: get transactions greater than specified amount
        [HttpGet("greater-than/{amount}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsGreaterThan(decimal amount)
        {
            var transactions = await _context.Transactions
                .Where(t => t.Amount > amount)
                .OrderByDescending(t => t.Date)
                .ToListAsync();

            return transactions;
        }

        // GET: get transactions less than specified amount
        [HttpGet("less-than/{amount}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsLessThan(decimal amount)
        {
            var transactions = await _context.Transactions
                .Where(t => t.Amount < amount)
                .OrderByDescending(t => t.Date)
                .ToListAsync();

            return transactions;
        }

        // GET: get a specific transaction by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            
            if (transaction == null)
            {
                return NotFound();
            }

            return transaction;
        }

        // POST: create a new transaction
        [HttpPost("create")]
        public async Task<ActionResult<Transaction>> CreateTransaction(Transaction transaction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, transaction);
        }

        // PUT: update existing transaction
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, Transaction transaction)
        {
            if (id != transaction.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(transaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: delete transaction
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // check if transaction exists
        private bool TransactionExists(int id)
        {
            return _context.Transactions.Any(e => e.Id == id);
        }
    }
}