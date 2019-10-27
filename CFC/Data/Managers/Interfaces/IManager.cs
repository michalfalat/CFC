using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Managers
{
    public interface IManager<T> where T: class
    {
        void Create(T entity);
        Task<T> FindById(int id);
        Task<List<T>> GetAll();
        void Edit(T entity);
        void Remove(T entity);
        void Unremove(T entity);

    }
}
