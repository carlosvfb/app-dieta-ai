import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import { colors } from '../../constants/Colors';
import { Header } from '@/components/header';
import  Select  from '@/components/input/select';
import { useDataStore } from '@/store/data';
import { router } from 'expo-router';

const schema = z.object({
  gender: z.string().min(1, { message: "O sexo é obrigatório!"}),
  objective: z.string().min(1, { message: "O objetivo é obrigatório!"}),
  level: z.string().min(1, { message: "Selecione seu level"}),
})

type FormData = z.infer<typeof schema>

export default function Create() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
      resolver: zodResolver(schema)
  })

  const setPageTwo = useDataStore(state => state.setPageTwo)

  const genderOptions = [
    { label: "Masculino", value: "Masculino" },
    { label: "Feminino", value: "Feminino" },
  ]

  const levelOptions = [
    { label: "Sedentário (pouco ou nenhuma atividade física)", value: "Sedentário" },
    { label: "Levemente ativo (exercicios de 1 a 3 vezes por semana)", value: "Levemente ativo (exercicios de 1 a 3 vezes por semana)" },
    { label: "Moderadamente ativo (exercicios de 3 a 5 vezes por semana)", value: "Moderadamente ativo (exercicios de 3 a 5 vezes por semana)" },
    { label: "Altamente ativo (exercicios de 5 a 7 vezes por semana)", value: "Altamente ativo (exercicios de 5 a 7 vezes por semana)" },
  ]

  const objectiveOptions = [
    { label: "Emagrecer", value: "Emagrecer" },
    { label: "Hipertrofia", value: "Hipertrofia" },
    { label: "Hipertrofia + Definição", value: "Hipertrofia e Definição" },
    { label: "Definição", value: "Definição" },
  ]

  function handleCreate(data: FormData) {
    setPageTwo({
      gender: data.gender,
      objective: data.objective,
      level: data.level,
    });

    router.push('/nutrition')
  }
 return (
   <View style={styles.container}>
      <Header step='Passo 2' title='Finalizando dieta'/>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Sexo:</Text>
        <Select
          control={control}
          name='gender'
          placeholder='Selecione seu sexo'
          error={errors.gender?.message}
          options={genderOptions}
        />
        <Text style={styles.label}>Selecione o nível de atividade física:</Text>
        <Select
          control={control}
          name='level'
          placeholder='Selecione seu nível de atividade física'
          error={errors.level?.message}
          options={levelOptions}
        />
        <Text style={styles.label}>Selecione seu objetivo:</Text>
        <Select
          control={control}
          name='objective'
          placeholder='Selecione o seu objetivo'
          error={errors.objective?.message}
          options={objectiveOptions}
        />

        <Pressable style={styles.button} onPress={handleSubmit(handleCreate)}>
          <Text style={styles.buttonText}>Avançar</Text>
        </Pressable>
      </ScrollView>

   </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: colors.background,
  },
  content: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  label: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.blue,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginTop: 16,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
});