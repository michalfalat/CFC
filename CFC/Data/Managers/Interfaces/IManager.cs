using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Managers
{
    public interface IManager<T> where T: class
    {
        void Create(T entity);
        T FindById(int id);

    }
}
