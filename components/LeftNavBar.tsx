import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { colors } from '../styles/color';

interface LeftNavBarProps {
  toggleNavBar: () => void;
}

const LeftNavBar: React.FC<LeftNavBarProps> = ({ toggleNavBar }) => {
  const navigation = useNavigation();

  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const categorySnapshot = await firestore().collection('categories').get();
      const categoriesData = await Promise.all(
        categorySnapshot.docs.map(async (categoryDoc) => {
          const categoryData = categoryDoc.data();
          const companiesSnapshot = await categoryDoc.ref.collection('companies').get();
          const companiesData = await Promise.all(
            companiesSnapshot.docs.map(async (companyDoc) => {
              const companyData = companyDoc.data();
              const productsSnapshot = await companyDoc.ref.collection('products').get();
              const productsData = productsSnapshot.docs.map(productDoc => ({ id: productDoc.id, ...productDoc.data() }));
              return { ...companyData, products: productsData };
            })
          );
          return { id: categoryDoc.id, ...categoryData, companies: companiesData };
        })
      );
      setCategories(categoriesData);
    };

    fetchData();
  }, []);

  const toggleCategory = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
      setExpandedSubCategory(null);
    }
  };

  const toggleSubCategory = (subCategoryName: string) => {
    if (expandedSubCategory === subCategoryName) {
      setExpandedSubCategory(null);
    } else {
      setExpandedSubCategory(subCategoryName);
    }
  };

  const navigateToProductDetail = (productId: string) => {
    navigation.navigate('ProductDetailPage', { productId });
    toggleNavBar();
  };
  const renderSubSubCategoryItem = (products: any[]) => (
    <View style={styles.subsubCategoryContainer}>
      {products.map((product) => (
        <TouchableOpacity key={product.id} style={styles.subsubcategoryItem} onPress={() => navigateToProductDetail(product.id)}>
          <Text style={styles.subsubcategoryText}>{product.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSubCategoryItem = (companies: any[]) => (
    <View style={styles.subcategoryContainer}>
      {companies.map(({ name, products }) => {
        const isExpanded = expandedSubCategory === name;
        return (
          <View key={name}>
            <TouchableOpacity style={styles.subcategoryItem} onPress={() => toggleSubCategory(name)}>
              <Text style={styles.subcategoryText}>{name}</Text>
              <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={colors.second} />
            </TouchableOpacity>
            {isExpanded && renderSubSubCategoryItem(products)}
          </View>
        );
      })}
    </View>
  );

  const renderCategoryItem = ({ id, name, icon, companies }: { id: string; name: string; icon: any; companies?: any[] }) => {
    const isExpanded = expandedCategory === name;

    return (
      <View key={id}>
        <TouchableOpacity style={styles.navItem} onPress={() => {
          if (companies) {
            toggleCategory(name);
          }
        }}>
          <Image source={{ uri: icon }} style={styles.categoryIcon} />
          <Text style={styles.navText}>{name}</Text>
          {companies && (
            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={colors.second} />
          )}
        </TouchableOpacity>
        {isExpanded && renderSubCategoryItem(companies)}
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
  subsubCategoryContainer: {
    marginTop: 5,
    paddingLeft: 20,
  },
  subsubcategoryItem: {
    paddingVertical: 10,
  },
  subsubcategoryText: {
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
