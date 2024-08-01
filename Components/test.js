import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';

const Test = () => {
  const [selected, setSelected] = useState('');
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    axios
      .get('https://dummyjson.com/products')
      .then((response) => {
        setProductData(response.data.products);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, []);

  // Map the productData to a format similar to your 'data' array
  const formattedData = productData.map((item, index) => ({
    key: String(index + 1), // You can use the index as the key
    value: item.title,
  }));

  return (
    <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
      <SelectList
        setSelected={item => setSelected(item.value)} // Set the selected item to the title
        data={formattedData} // Use the formatted data
      />
      <Text>Selected item: {selected}</Text>
    </View>
  );
};

export default Test;
