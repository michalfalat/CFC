using CFC.Data.Entities;
using CFC.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace CFC.Data
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected ApplicationDbContext Context { get; set; }

        public Repository(ApplicationDbContext repositoryContext)
        {
            this.Context = repositoryContext;
        }

        public IQueryable<T> FindAll()
        {
            return this.Context.Set<T>().AsNoTracking();
        }


        //public T FindById(int id)
        //{
        //    return this.Context.Set<T>().FirstOrDefault(a => a.)
        //}

        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression)
        {
            return this.Context.Set<T>().Where(expression).AsNoTracking();
        }

        public void Create(T entity)
        {
            this.Context.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            this.Context.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            this.Context.Set<T>().Remove(entity);
        }

        public void Save()
        {
            this.Context.SaveChanges();
        }

        public Task SaveAsync()
        {
            return this.Context.SaveChangesAsync();
        }
    }
}
