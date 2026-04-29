import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from '../firebase/productService';

export default function HomeScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  async function loadProducts() {
    try {
      const productList = await getProducts();
      setProducts(productList);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // Melhoria 3: atualiza só o barcode sem apagar name e price
  useEffect(() => {
    if (route.params?.scannedBarcode) {
      setBarcode(String(route.params.scannedBarcode));
      navigation.setParams({ scannedBarcode: undefined });
    }
  }, [route.params?.scannedBarcode]);

  function clearForm() {
    setName('');
    setPrice('');
    setBarcode('');
    setEditingProductId(null);
  }

  async function handleSaveProduct() {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Atenção', 'Preencha nome e preço do produto.');
      return;
    }

    const productData = {
      name: name.trim(),
      price: price.trim(),
      barcode: barcode ? String(barcode).trim() : '',
    };

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      } else {
        await createProduct(productData);
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      }

      clearForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o produto.');
    }
  }

  function handleEditProduct(product) {
    setName(product.name || '');
    setPrice(product.price || '');
    setBarcode(product.barcode || '');
    setEditingProductId(product.id);
  }

  function handleCancelEdit() {
    clearForm();
  }

  async function handleDeleteProduct(productId) {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(productId);
              if (editingProductId === productId) clearForm();
              Alert.alert('Sucesso', 'Produto excluído com sucesso!');
              await loadProducts();
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Não foi possível excluir o produto.');
            }
          },
        },
      ]
    );
  }

  function handleOpenScanner() {
    navigation.navigate('BarcodeScanner');
  }

  return (
    // Melhoria 2 e 4: teclado + rolagem
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 24, marginTop: 20, marginBottom: 20 }}>
          Bem-vindo!
        </Text>

        <View style={{ marginBottom: 20 }}>
          <Button title="Ler código de barras" onPress={handleOpenScanner} />
        </View>

        {/* Melhoria 1: campos com borderRadius e returnKeyType */}
        <TextInput
          placeholder="Nome do produto"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          style={{
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 10,
            padding: 10,
          }}
        />

        <TextInput
          placeholder="Preço"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          returnKeyType="next"
          style={{
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 10,
            padding: 10,
          }}
        />

        <TextInput
          placeholder="Código de barras"
          value={barcode}
          onChangeText={setBarcode}
          returnKeyType="done"
          onSubmitEditing={handleSaveProduct}
          style={{
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 20,
            padding: 10,
          }}
        />

        <Button
          title={editingProductId ? 'Atualizar produto' : 'Cadastrar produto'}
          onPress={handleSaveProduct}
        />

        {editingProductId && (
          <View style={{ marginTop: 10 }}>
            <Button title="Cancelar edição" onPress={handleCancelEdit} />
          </View>
        )}

        <Text style={{ fontSize: 20, marginTop: 30, marginBottom: 10 }}>
          Produtos cadastrados
        </Text>

        {/* Melhoria 4: .map() no lugar de FlatList para evitar conflito com ScrollView */}
        {products.length === 0 ? (
          <Text>Nenhum produto cadastrado.</Text>
        ) : (
          products.map((item) => (
            <View
              key={item.id}
              style={{
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
            >
              <Text>Nome: {item.name}</Text>
              <Text>Preço: {item.price}</Text>
              <Text>Código de barras: {item.barcode || 'Não informado'}</Text>

              <View style={{ marginTop: 10 }}>
                <Button title="Editar" onPress={() => handleEditProduct(item)} />
              </View>

              <View style={{ marginTop: 10 }}>
                <Button title="Excluir" onPress={() => handleDeleteProduct(item.id)} />
              </View>
            </View>
          ))
        )}

        <View style={{ marginTop: 20, marginBottom: 40 }}>
          <Button title="Sair" onPress={() => navigation.navigate('Login')} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}