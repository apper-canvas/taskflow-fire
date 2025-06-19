import categoriesData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    await delay(200);
    return [...this.categories];
  }

  async getById(id) {
    await delay(150);
    const category = this.categories.find(cat => cat.Id === parseInt(id, 10));
    return category ? { ...category } : null;
  }

  async create(categoryData) {
    await delay(300);
    const maxId = this.categories.length > 0 ? Math.max(...this.categories.map(c => c.Id)) : 0;
    const newCategory = {
      Id: maxId + 1,
      name: categoryData.name,
      color: categoryData.color || '#5B47E0',
      icon: categoryData.icon || 'Folder',
      order: this.categories.length
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    const updatedCategory = {
      ...this.categories[index],
      ...updates,
      Id: this.categories[index].Id // Prevent Id modification
    };
    
    this.categories[index] = updatedCategory;
    return { ...updatedCategory };
  }

  async delete(id) {
    await delay(200);
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    const deletedCategory = this.categories.splice(index, 1)[0];
    return { ...deletedCategory };
  }
}

export default new CategoryService();