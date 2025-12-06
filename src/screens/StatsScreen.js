import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { TimerContext } from '../context/TimerContext';
import { Ionicons } from '@expo/vector-icons';
import { ContributionGraph, BarChart } from "react-native-chart-kit";

const StatsScreen = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { history, currentTheme, t } = useContext(TimerContext);

  const totalFocusMinutes = Math.floor(history.filter(h => h.mode === 'Focus').reduce((acc, curr) => acc + curr.duration, 0) / 60);
  const totalSessions = history.length;

  const getContributionData = () => {
    const data = {};
    history.forEach(item => {
      if (item.mode === 'Focus') {
        const date = item.date.split('T')[0];
        if (data[date]) data[date]++; else data[date] = 1;
      }
    });
    const result = Object.keys(data).map(date => ({ date, count: data[date] }));
    // Eğer veri yoksa boş bir giriş ekle ki grafik bozulmasın
    if (result.length === 0) return [{ date: new Date().toISOString().split('T')[0], count: 0 }];
    return result;
  };

  const contributionData = getContributionData();

  const getWeeklyData = () => {
    const days = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
    const data = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bugünü sıfırla

    history.forEach(item => {
      if (item.mode === 'Focus') {
        const itemDate = new Date(item.date);
        itemDate.setHours(0, 0, 0, 0); // Kayıt tarihini sıfırla

        const diffTime = Math.abs(today - itemDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 7) { // Son 7 gün
          const dayIndex = itemDate.getDay();
          data[dayIndex] += (item.duration / 60);
        }
      }
    });
    return { labels: days, datasets: [{ data }] };
  };

  const chartConfig = {
    backgroundGradientFrom: currentTheme.bg,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: currentTheme.bg,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => currentTheme.accent,
    labelColor: (opacity = 1) => currentTheme.text,
    strokeWidth: 2,
    barPercentage: 0.6,
    decimalPlaces: 0,
    propsForDots: { r: "0" }, // Çizgileri temizle
    fillShadowGradient: currentTheme.accent,
    fillShadowGradientOpacity: 0.5,
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={currentTheme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme.text, fontFamily: currentTheme.font }]}>{t('stats')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          <View style={[styles.card, { borderColor: currentTheme.secondary, backgroundColor: currentTheme.secondary + '10' }]}>
            <Ionicons name="hourglass-outline" size={24} color={currentTheme.accent} style={{ marginBottom: 5 }} />
            <Text style={[styles.cardVal, { color: currentTheme.text }]}>{totalFocusMinutes}</Text>
            <Text style={[styles.cardLbl, { color: currentTheme.text }]}>{t('focusTimeStat')}</Text>
          </View>
          <View style={[styles.card, { borderColor: currentTheme.secondary, backgroundColor: currentTheme.secondary + '10' }]}>
            <Ionicons name="checkmark-circle-outline" size={24} color={currentTheme.accent} style={{ marginBottom: 5 }} />
            <Text style={[styles.cardVal, { color: currentTheme.text }]}>{totalSessions}</Text>
            <Text style={[styles.cardLbl, { color: currentTheme.text }]}>{t('sessionsStat')}</Text>
          </View>
        </View>

        <View style={[styles.chartContainer, { borderColor: currentTheme.secondary + '30' }]}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>{t('focusCalendar')}</Text>
          <View style={{ overflow: 'hidden', marginLeft: -10 }}>
            <ContributionGraph
              values={contributionData}
              endDate={new Date()}
              numDays={95}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              gutterSize={4}
              squareSize={18}
              tooltipDataAttrs={(value) => ({ rx: "5" })}
            />
          </View>
        </View>

        <View style={[styles.chartContainer, { borderColor: currentTheme.secondary + '30' }]}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>{t('last7Days')}</Text>
          <BarChart
            data={getWeeklyData()}
            width={screenWidth - 60}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: "transparent",
              backgroundGradientFromOpacity: 0,
              backgroundGradientTo: "transparent",
              backgroundGradientToOpacity: 0,
              color: (opacity = 1) => currentTheme.accent,
              labelColor: (opacity = 1) => currentTheme.text,
              strokeWidth: 2,
              barPercentage: 0.7,
              decimalPlaces: 0,
              fillShadowGradient: currentTheme.accent,
              fillShadowGradientOpacity: 1, // Solid bars
            }}
            verticalLabelRotation={0}
            fromZero={true}
            showBarTops={true}
            showValuesOnTopOfBars={true}
            withInnerLines={false}
            withYAxisLabels={true}
            style={{
              borderRadius: 16,
              marginTop: 10,
              paddingRight: 0,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  content: { padding: 20, paddingBottom: 50 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', gap: 15, marginBottom: 25 },
  card: { flex: 1, padding: 20, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cardVal: { fontSize: 28, fontWeight: 'bold', marginVertical: 5 },
  cardLbl: { fontSize: 12, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, letterSpacing: 0.5 },
  chartContainer: { marginBottom: 25, padding: 15, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.2)' }
});

export default StatsScreen;