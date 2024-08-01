import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { colors } from '../styles/color';

interface LeftNavBarProps {
  toggleNavBar: () => void;
}

const LeftNavBar: React.FC<LeftNavBarProps> = ({ toggleNavBar }) => {
  const navigation = useNavigation();

  const [categories, setCategories] = useState<any[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categorySnapshot = await firestore().collection('Main').get();
        const categoriesData = await Promise.all(
          categorySnapshot.docs.map(async (categoryDoc) => {
            const categoryData = categoryDoc.data();
            const categoryName = categoryDoc.id;
            const subcategorySnapshot = await categoryDoc.ref.collection('Category').get();
            const subcategoriesData = await Promise.all(
              subcategorySnapshot.docs.map(async (subcategoryDoc) => {
                const subcategoryData = subcategoryDoc.data();
                const subcategoryName = subcategoryDoc.id;
                const productSnapshot = await subcategoryDoc.ref.collection('Products').get();
                const productsData = productSnapshot.docs.map(productDoc => ({ id: productDoc.id, ...productDoc.data() }));
                return { id: subcategoryName, ...subcategoryData, products: productsData };
              })
            );
            return { id: categoryName, ...categoryData, subcategories: subcategoriesData };
          })
        );
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
      setExpandedSubCategory(null);
    } else {
      setExpandedCategory(categoryName);
      setExpandedSubCategory(null);
    }
  };

  const toggleSubCategory = (subCategoryName: string) => {
    setExpandedSubCategory(prev => prev === subCategoryName ? null : subCategoryName);
  };

  const navigateToProductDetail = (productId: string, mainId: string, categoryId: string) => {
    navigation.navigate('ProductDetailPage', { productId, mainId, categoryId });
    toggleNavBar();
  };
  
  const renderProductItem = (products: any[], mainId: string, categoryId: string) => (
    <View style={styles.productContainer}>
      {products.map((product) => (
        <TouchableOpacity
          key={product.id}
          style={styles.productItem}
          onPress={() => navigateToProductDetail(product.id, mainId, categoryId)}
        >
          <Text style={styles.productText}>{product.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  

  const renderSubCategoryItem = (subcategories: any[], mainId: string) => (
    <View style={styles.subcategoryContainer}>
      {subcategories.map(({ id, name, products }) => {
        const isExpanded = expandedSubCategory === id;
        return (
          <View key={id}>
            <TouchableOpacity
              style={styles.subcategoryItem}
              onPress={() => toggleSubCategory(id)}
            >
              <Text style={styles.subcategoryText}>{name}</Text>
              <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={colors.second} />
            </TouchableOpacity>
            {isExpanded && renderProductItem(products, mainId, id)}
          </View>
        );
      })}
    </View>
  );
  
  const renderCategoryItem = ({ id, name, icon, subcategories }: { id: string; name: string; icon: any; subcategories?: any[] }) => {
    const isExpanded = expandedCategory === id;
  
    return (
      <View key={id}>
        <TouchableOpacity style={styles.navItem} onPress={() => toggleCategory(id)}>
          <Text style={styles.navText}>{name}</Text>
          {subcategories && (
            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={colors.second} />
          )}
        </TouchableOpacity>
        {isExpanded && renderSubCategoryItem(subcategories, id)}
      </View>
    );
  };
  

  return (
    <View style={styles.navContainer}>
      <View style={styles.categoriesHeader}>
        <Text style={styles.categoriesHeaderText}>Categories</Text>
        <TouchableOpacity onPress={toggleNavBar}>
          <Icon name="close" size={32} color={colors.inputPlaceholder} style={styles.backIcon} />
        </TouchableOpacity>
      </View>
      {categories.map((category) => renderCategoryItem(category))}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  navText: {
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 10,
    marginRight: 'auto',
    color: colors.TextBlack,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  subcategoryContainer: {
    marginTop: 5,
    paddingLeft: 20,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  subcategoryText: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.TextBlack,
  },
  productContainer: {
    marginTop: 5,
    paddingLeft: 20,
  },
  productItem: {
    paddingVertical: 10,
  },
  productText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.TextBlack,
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoriesHeaderText: {
    fontSize: 32,
    fontWeight: '500',
    color: colors.main,
  },
  backIcon: {
    marginRight: 2,
  },
});

export default LeftNavBar;
