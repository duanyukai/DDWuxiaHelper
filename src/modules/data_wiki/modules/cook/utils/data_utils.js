import cookbook from '../assets/cookbook.json';
import materials from '../assets/material.json';

// cdn头
export const IMG_BASE_DOMAIN = 'https://wuxia-tools-assets-1251080372.cos.ap-shanghai.myqcloud.com';

// 合并完整菜谱信息
let fullCookbook = null;
export function getFullCookbook() {
  if (!fullCookbook) {
    fullCookbook = cookbook.map(recipe => {
      return {
        ...recipe,
        materials: recipe.materials.map(materialId => {
          let material = materials.find(m => m.materialId === materialId);
          return  {...material};
        })
      };
    });
  }
  return fullCookbook;
}

// 根据菜谱和食材信息获取合并后的菜谱数据
export function getRecipe(productId) {
  let product = {...cookbook.find(c => c.productId === productId)};
  product.materials = product.materials.map(materialId => {
    let material = materials.find(m => m.materialId === materialId);
    return  {
      ...material
    };
  });
  return product;
}

// 根据筛选条件获取菜谱列表
export function getFilteredRecipeList(name, keyword, minLevel, maxLevel, onlyCritical, onlyFeast) {
  let cookbook = getFullCookbook();
  cookbook = cookbook.filter(recipe => {
    // 过滤菜名
    if (name && !recipe.name.includes(name))
      return false;
    // 过滤关键词
    if (keyword && !(recipe.des + recipe.propDes).includes(name))
      return false;
    // 过滤等级
    if (minLevel && maxLevel && (recipe.level < minLevel || recipe.level > maxLevel))
      return false;
    // 过滤仅暴击
    if (onlyCritical && !recipe.criticalName)
      return false;
    // 过滤仅宴席
    if (onlyFeast && !recipe.criticalName && recipe.criticalPropDes.includes('宴席'))
      return false;
    return true;
  });
  return cookbook;
}