import React, { useState, useContext, createContext, useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, ScrollView, Image } from 'react-native';
import { 
  Provider as PaperProvider, 
  Appbar, 
  Card, 
  Title, 
  Paragraph, 
  Chip, 
  List, 
  Button,
  useTheme,
  configureFonts,
  DefaultTheme,
  ProgressBar,
} from 'react-native-paper';
import { Ionicons, FontAwesome, AntDesign, Feather } from '@expo/vector-icons';
import axios from 'axios';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3f51b5', // Purple color
    accent: '#ff4081',
  },
  fonts: configureFonts({
    default: {
      regular: {
        fontFamily: 'Roboto',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'Roboto-Medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'Roboto-Light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'Roboto-Thin',
        fontWeight: 'normal',
      },
    },
  }),
};

const OrderContext = createContext();

const useSlideInAnimation = (delay = 0) => {
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, delay]);

  return slideAnim;
};

const OrderItemsScreen = ({route}) => {
  const [address, setAddress] = useState('');
  const theme = useTheme();
  const slideAnim = useSlideInAnimation();
  const { products, Bonlivraison } = route.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'http://192.168.0.48/logo/Components/Roles/interfaces/phpfolderv2/getclientbyid.php',
          { id: Bonlivraison.id_client },
          { responseType: 'json' }
        );
        setAddress(response.data.userData[0].addresse);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [Bonlivraison.id_client]);

  const orderDetails = {
    product: products[0].name, // Product name from dynamic data
    orderNumber: products[0].category, // Category from dynamic data
    orderDate: products[0].price, // Price from dynamic data
    sku: products[0].quantity, // Quantity from dynamic data
    customerName: `${Bonlivraison.prenom_client} ${Bonlivraison.nom_client}`, // Client name from dynamic data
    address: address, // Address from axios response
    status: 'In Transit',
    estimatedDelivery: Bonlivraison.date_livraison, // Date from dynamic data
  };

  const OrderInfoItem = ({ icon, title, content }) => {
    const itemSlideAnim = useSlideInAnimation(title.length * 50);
    return (
      <Animated.View style={{ transform: [{ translateX: itemSlideAnim }] }}>
        <List.Item
          title={title}
          description={content}
          left={props => <View {...props}>{icon}</View>}
        />
      </Animated.View>
    );
  };

  return (
    <OrderContext.Provider value={orderDetails}>
      <PaperProvider theme={theme}>
        <ScrollView style={styles.container}>
          <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.imageContainer}>
                <Image source={{ uri: `http://192.168.0.48/logo/Components/Roles/interfaces/Products/${products[0].image}` }}
                    style={styles.productImage}
                  />
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title>Product Details</Title>
                <OrderInfoItem 
                  icon={<FontAwesome name="shopping-bag" size={24} color={theme.colors.primary} />} 
                  title="Product" 
                  content={orderDetails.product} 
                />
                <OrderInfoItem 
                  icon={<AntDesign name="tags" size={24} color={theme.colors.primary} />} 
                  title="Category" 
                  content={orderDetails.orderNumber} 
                />
                <OrderInfoItem 
                  icon={<AntDesign name="question" size={24} color={theme.colors.primary} />} 
                  title="Price" 
                  content={`$${orderDetails.orderDate}`} 
                />
                <OrderInfoItem 
                  icon={<FontAwesome name="hashtag" size={24} color={theme.colors.primary} />} 
                  title="Quantity" 
                  content={orderDetails.sku} 
                />
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title>Shipping Information</Title>
                <Paragraph style={styles.contactName}>{orderDetails.customerName}</Paragraph>
                <Paragraph>{orderDetails.address}</Paragraph>
                <View style={styles.statusContainer}>
                  <Title style={styles.statusTitle}>Order Status</Title>
                  <Chip icon={() => <Feather name="truck" size={16} color={theme.colors.primary} />} mode="outlined" style={styles.statusChip}>
                    {orderDetails.status}
                  </Chip>
                </View>
                <ProgressBar progress={0.5} color={theme.colors.primary} style={styles.progressBar} />
                <Paragraph style={styles.estimatedDelivery}>
                  Estimated Delivery: {orderDetails.estimatedDelivery}
                </Paragraph>
              </Card.Content>
            </Card>

            <Button 
              mode="contained" 
              onPress={() => { }} 
              style={styles.trackButton}
              icon={() => <Ionicons name="location" size={20} color="#fff" />}
            >
              Track Order
            </Button>
          </Animated.View>
        </ScrollView>

      </PaperProvider>
    </OrderContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  appbar: {
    elevation: 0,
    backgroundColor: '#3f51b5', // Purple color
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  productImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  contactName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  trackButton: {
    marginTop: 16,
  },

  statusContainer: {
    marginTop: 16,
  },
  statusTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  estimatedDelivery: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 70,
  },
});

export default OrderItemsScreen;
