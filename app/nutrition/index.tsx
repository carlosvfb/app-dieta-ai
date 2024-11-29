import { useDataStore } from "@/store/data";
import { View, Text, StyleSheet, Pressable, ScrollView, Share } from "react-native";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { colors } from "@/constants/Colors";
import { Data } from "@/types/data";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface ResponseData {
  data: Data;
}

export default function Nutrition() {
  const user = useDataStore((state) => state.user);

  console.log(user);

  const { data, isFetching, error } = useQuery({
    queryKey: ["nutrition"],
    queryFn: async () => {
      try {
        if (!user) {
          throw new Error("Filed load nutrition");
        }

        const response = await api.post<ResponseData>("/create", {
          name: user.name,
          weight: user.weight,
          age: user.age,
          height: user.height,
          gender: user.gender,
          objective: user.objective,
          level: user.level
        });
        console.log(response.data.data);

        return response.data.data;
      } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch nutrition data");
      }
    },
  });

  async function hendleShare() {
    try {
      if (data && Object.keys(data).length === 0) return;

      const suplements = `${data?.suplementos.map(item => `- ${item}`)}`

      const foods = `${data?.refeicoes.map(item => `\n- Refeição: ${item.nome}\n- Horário: ${item.horario}\n- Alimentos: ${item.alimentos.map(alimento => `${alimento}`)}`)}`
      
      const message = `Dieta: ${data?.nome}\n - Objetivo: ${data?.objetivo}\n\n${foods}\n\n- Dica de suplementos: ${suplements}`

      await Share.share({
        message: message,
        title: "Minha Dieta",
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (isFetching) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Estamos gerando sua dieta</Text>
        <Text style={styles.loadingText}>Consultando IA...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Falha ao gerar dieta!</Text>
        <Link href="/step">
          <Text style={styles.loadingText}>Tente novamente</Text>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <View style={styles.contentHeader}>
          <Text style={styles.title}>Minha dieta</Text>

          <Pressable style={styles.buttonShare} onPress={hendleShare}>
            <Text style={styles.buttonShareText}>Compartilhar</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={{ paddingHorizontal: 16, flex: 1 }}>
        {data && Object.keys(data).length > 0 && (
          <>
            <Text style={styles.name}>Nome: {data.nome}</Text>
            <Text style={styles.objective}>Foco: {data.objetivo}</Text>

            <Text style={styles.label}>Refeições:</Text>

            <ScrollView>
              <View style={styles.foods}>
                {data.refeicoes.map((refeicao) => (
                  <View key={refeicao.nome} style={styles.food}>
                    <View style={styles.foodHeader}>
                      <Text style={styles.foodName}>{refeicao.nome}</Text>
                      <Ionicons name="restaurant" size={16} color="#000" />
                    </View>

                    <View style={styles.foodContent}>
                      <Ionicons name="time" size={14} color="#000" />
                      <Text>Horário: {refeicao.horario}</Text>
                    </View>

                    <Text style={styles.foodText}>Alimentos:</Text>
                    {refeicao.alimentos.map((alimento) => (
                      <Text key={alimento} style={styles.foodList}>
                        {alimento}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
                    <View style={styles.suplements}>
                      <Text style={styles.suplementsText}>
                        Dica de suplementos:
                      </Text>
                      {data.suplementos.length > 0 ? (
                        data.suplementos.map((suplemento) => (
                          <Text key={suplemento} style={styles.suplementsList}>
                            {suplemento}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.foodText}>
                          Nenhum suplemento recomendado para este horário.
                        </Text>
                      )}
                    </View>

              <Pressable style={styles.button} onPress={() => router.replace('/')}>
                <Text style={styles.buttonText}>Gerar nova dieta</Text>
              </Pressable>
            </ScrollView>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: colors.white,
    fontSize: 18,
    marginBottom: 4,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerHeader: {
    backgroundColor: colors.white,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 14,
    marginBottom: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.background,
  },
  buttonShare: {
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    padding: 8,
  },
  buttonShareText: {
    color: colors.white,
    fontWeight: "500",
  },
  name: {
    fontSize: 20,
    color: colors.white,
    fontWeight: "bold",
    marginBottom: 8,
  },
  objective: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "bold",
  },
  foods: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  food: {
    backgroundColor: "rgba(208, 208, 208, 0.40)",
    padding: 8,
    borderRadius: 4,
  },
  foodHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  foodContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  foodText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
    marginTop: 14,
  },
  foodList: {
    fontSize: 15,
    marginLeft: 4,
    marginBottom: 2,
  },
  suplements: {
    marginTop: 14,
    marginBottom: 14,
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 8,
  },
  suplementsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  suplementsList: {
    fontSize: 15,
    marginTop: 2,
  },
  button: {
    backgroundColor: colors.blue,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },

});
