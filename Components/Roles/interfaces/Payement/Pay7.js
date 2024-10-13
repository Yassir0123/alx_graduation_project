import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import axios from 'axios';
const { width } = Dimensions.get('window');

const App = ({ route }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState(null);
  const { Bonlivraison, totalTVA, totalTax } = route.params;

  useEffect(() => {
    // Fetch client information
    const fetchClientData = async () => {
      try {
        
        const response = await axios.post(
         'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getpaybybon.php',
          { id: route.params.id_bonlivraison},
          { responseType: 'json' }
        );
        setClientData(response.data.userData[0]);
        setLoading(false);
  
      } catch (error) {
        console.error('Error fetching client data:', error);
        setLoading(false);
      }
    };

    fetchClientData();
  }, [Bonlivraison]);

  const handleGetPDF = async () => {
    const html = `
      <html>
      <body>
        <h1>Payment Receipt</h1>
        <ul>
          <li><strong>Ref Number:</strong> ${clientData.id_paiement}</li>
          <li><strong>Payment Method:</strong> ${clientData.moyen_paiement}</li>
          <li><strong>Payment Date:</strong> ${clientData.date_paiement}</li>
          <li><strong>Total Payment:</strong> $${clientData.montant_totale}</li>
        </ul>
      </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      console.log('PDF generated at:', uri);
      // Optionally, you can open the generated PDF for preview
      // await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleShare = async () => {
    const html = `
      <html>
      <body>
        <h1>Payment Receipt</h1>
        <ul>
          <li><strong>Ref Number:</strong> ${clientData.id_paiement}</li>
          <li><strong>Payment Method:</strong> ${clientData.moyen_paiement}</li>
          <li><strong>Payment Date:</strong> ${clientData.date_paiement}</li>
          <li><strong>Total Payment:</strong> $${clientData.montant_totale}</li>
        </ul>
      </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      console.log('PDF generated at:', uri);
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error sharing PDF:', error);
    }
  };

  const renderTabContent = () => {
    if (loading || !clientData) {
      return <Text>Loading...</Text>;
    }

    switch (activeTab) {
      case 'details':
        return (
          <>
            <View style={styles.row}>
              <Text style={styles.headerText}>Ref Number</Text>
              <Text style={styles.valueText}>{clientData.id_paiement}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.headerText}>Payment Method</Text>
              <Text style={styles.valueText}>{clientData.moyen_paiement}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.headerText}>Payment Date</Text>
              <Text style={styles.valueText}>{clientData.date_paiement}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.headerText}>Total Payment</Text>
              <Text style={styles.valueText}>${clientData.montant_totale}</Text>
            </View>
          </>
        );
      case 'breakdown':
        return (
          <View style={styles.breakdownContainer}>
            <Text style={styles.breakdownTitle}>Payment Breakdown</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Subtotal</Text>
              <Text style={styles.breakdownValue}>${clientData.montant_payer}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Tax (${totalTVA.toFixed(2)}%)</Text>
              <Text style={styles.breakdownValue}>${totalTax}</Text>
            </View>
            <View style={[styles.breakdownRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${clientData.montant_totale}</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <LinearGradient
          colors={['#4A00E0', '#8E2DE2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <View style={styles.headerContent}>
            <Image
              source={{ uri: 'https://media.tenor.com/REoBdf2ztLEAAAAj/check-mark-good.gif' }}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.subtext}>Payment Successful</Text>
            <Text style={styles.heading}>${clientData ? clientData.montant_totale : 'Loading...'}</Text>
          </View>
        </LinearGradient>
        <View style={styles.card}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'details' && styles.activeTab]}
              onPress={() => setActiveTab('details')}
            >
              <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'breakdown' && styles.activeTab]}
              onPress={() => setActiveTab('breakdown')}
            >
              <Text style={[styles.tabText, activeTab === 'breakdown' && styles.activeTabText]}>Breakdown</Text>
            </TouchableOpacity>
          </View>
          {renderTabContent()}
        {/* <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleGetPDF}>
              <Ionicons name="document-text-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Get PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.shareButton]} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#4A00E0" />
              <Text style={[styles.buttonText, styles.shareButtonText]}>Share</Text>
            </TouchableOpacity>
          </View>*/} 
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  scrollView: {
    flexGrow: 1,
  },
  gradientBackground: {
    paddingTop: 60,
    paddingBottom: 100,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  subtext: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 5,
    fontWeight: '600',
  },
  heading: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    margin: 20,
    marginTop: -80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#F0F2F5',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4A00E0',
  },
  tabText: {
    color: '#4A00E0',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  headerText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  valueText: {
    color: '#888888',
    fontSize: 16,
  },
  breakdownContainer: {
    paddingVertical: 10,
  },
  breakdownTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  breakdownLabel: {
    color: '#888888',
    fontSize: 16,
  },
  breakdownValue: {
    color: '#333333',
    fontSize: 16,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A00E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4A00E0',
  },
  shareButtonText: {
    color: '#4A00E0',
  },
});

export default App;
