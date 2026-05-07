# WAY WATCH Component Examples & Showcase

This guide shows practical examples of using each component in the modern redesign.

## 🎨 Basic Components

### GlassCard - Frosted Glass Container

```javascript
import GlassCard from './components/GlassCard';
import { colors, spacing, typography } from './theme/colors';

// Basic card
<GlassCard>
  <Text style={typography.body_lg}>Hello World</Text>
</GlassCard>

// Interactive card with gradient
<GlassCard
  onPress={() => console.log('Pressed!')}
  hasGradient={true}
  glassIntensity="medium"
  padding={spacing.lg}
  shadow="lg"
>
  <Text>Tap me!</Text>
</GlassCard>

// Dark glass card with custom border
<GlassCard
  glassIntensity="dark"
  borderColor="border_light"
  padding={spacing.md}
  shadow="sm"
>
  <Text>Subtle card</Text>
</GlassCard>
```

### SeverityBadge - Pothole Severity Indicator

```javascript
import SeverityBadge from './components/SeverityBadge';

// Show severity with label
<SeverityBadge severity={3} size="md" showLabel={true} />
// Output: Critical (red badge)

// Small badge without label
<SeverityBadge severity={1} size="sm" showLabel={false} />
// Output: Green dot only

// Large badge for emphasis
<SeverityBadge severity={2} size="lg" />
// Output: Medium (yellow badge)

// Usage in list
{potholes.map(pothole => (
  <View key={pothole.id}>
    <SeverityBadge severity={pothole.severity} size="sm" />
  </View>
))}
```

### AnimatedStatCard - Animated Metric Display

```javascript
import AnimatedStatCard from './components/AnimatedStatCard';
import { colors } from './theme/colors';

// Simple metric
<AnimatedStatCard
  label="Total Issues"
  value={42}
  icon="🚨"
  color={colors.primary}
/>

// With trend indicator
<AnimatedStatCard
  label="Critical Potholes"
  value={5}
  icon="🔴"
  color={colors.critical}
  trend={{
    value: "↑ 2",
    isPositive: false  // Going up is bad for potholes
  }}
/>

// With unit display
<AnimatedStatCard
  label="System Uptime"
  value={99.8}
  unit="%"
  icon="⚡"
  color={colors.low}
/>

// In a grid layout
<View style={{ flexDirection: 'row', gap: 12 }}>
  <View style={{ flex: 1 }}>
    <AnimatedStatCard
      label="Critical"
      value={5}
      icon="🔴"
      color={colors.critical}
    />
  </View>
  <View style={{ flex: 1 }}>
    <AnimatedStatCard
      label="Medium"
      value={12}
      icon="🟡"
      color={colors.medium}
    />
  </View>
</View>
```

### FloatingActionButton - Modern FAB

```javascript
import FloatingActionButton from './components/FloatingActionButton';
import { colors } from './theme/colors';

// Refresh button
<FloatingActionButton
  onPress={() => fetchData()}
  icon="🔄"
  variant="primary"
  size="lg"
  position="bottom-right"
/>

// Delete button
<FloatingActionButton
  onPress={() => deleteItem()}
  icon="🗑️"
  variant="danger"
  size="md"
  position="bottom-left"
/>

// Secondary action
<FloatingActionButton
  onPress={() => openMenu()}
  icon="⚙️"
  variant="secondary"
  size="sm"
  position="top-right"
  margin={20}
/>

// Multiple FABs
<View>
  <FloatingActionButton icon="📍" position="bottom-right" />
  <FloatingActionButton icon="➕" position="bottom-left" />
</View>
```

## 📊 Data Display Components

### AIInsightCard - AI Insight Display

```javascript
import AIInsightCard from './components/AIInsightCard';

// Critical alert
<AIInsightCard
  title="Critical Alert"
  description="3 critical potholes detected in downtown area"
  severity="critical"
  icon="🚨"
  actionText="View Map"
  onPress={() => navigateToMap()}
/>

// Warning/recommendation
<AIInsightCard
  title="Maintenance Recommended"
  description="Schedule preventive repairs for 12 medium-level issues"
  severity="warning"
  icon="🔧"
  actionText="Schedule"
  onPress={() => openScheduler()}
/>

// Information
<AIInsightCard
  title="System Status"
  description="All systems operational. Road health: Excellent"
  severity="info"
  icon="✅"
/>

// In a scrollable list
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  <AIInsightCard title="Alert 1" description="..." />
  <AIInsightCard title="Alert 2" description="..." />
</ScrollView>
```

### ModernHeader - App Header

```javascript
import ModernHeader from './components/ModernHeader';

// Basic header
<ModernHeader
  title="WAY WATCH"
  subtitle="Smart Road Monitoring"
  statusIndicator="online"
/>

// Offline status
<ModernHeader
  title="WAY WATCH"
  subtitle="Smart Road Monitoring"
  statusIndicator="offline"
/>

// Custom titles
<ModernHeader
  title="Dashboard"
  subtitle="Real-time Infrastructure"
  statusIndicator="online"
  showAnimation={true}
/>
```

### AIInsightsDashboard - Comprehensive AI Panel

```javascript
import AIInsightsDashboard from './components/AIInsightsDashboard';

// Full dashboard view
<AIInsightsDashboard
  stats={{
    totalPotholes: 42,
    severityCounts: { 1: 20, 2: 15, 3: 7 },
    totalConfirmations: 35
  }}
  potholes={potholeList}
/>

// In a scrollable section
<ScrollView>
  <AIInsightsDashboard
    stats={stats}
    potholes={potholes}
  />
</ScrollView>
```

## 🎭 Interaction Components

### PotholeBottomSheet - Detail Modal

```javascript
import PotholeBottomSheet from './components/PotholeBottomSheet';

// Basic usage
const [visible, setVisible] = useState(false);
const [selectedPothole, setSelectedPothole] = useState(null);

const handlePotholePress = (pothole) => {
  setSelectedPothole(pothole);
  setVisible(true);
};

<PotholeBottomSheet
  visible={visible}
  pothole={selectedPothole}
  onClose={() => setVisible(false)}
  onConfirm={(id, exists) => {
    handleConfirmation(id, exists);
    setVisible(false);
  }}
  severityLabels={{
    1: "Low Impact",
    2: "Medium Impact",
    3: "Critical"
  }}
/>

// With map integration
<PotholeMap
  potholes={potholes}
  onPotholePress={handlePotholePress}
/>
```

### LoadingScreen - Loading Animation

```javascript
import LoadingScreen from './components/LoadingScreen';

// Show during data fetch
{loading ? (
  <LoadingScreen />
) : (
  <MainContent />
)}

// During app initialization
const [appReady, setAppReady] = useState(false);

useEffect(() => {
  initializeApp().then(() => {
    setAppReady(true);
  });
}, []);

return appReady ? <App /> : <LoadingScreen />;
```

### EmptyState - Empty State Screen

```javascript
import EmptyState from './components/EmptyState';

// Show when no data
{potholes.length === 0 ? (
  <EmptyState />
) : (
  <PotholeList potholes={potholes} />
)}
```

## 🎨 Layout Patterns

### Dashboard Grid Layout

```javascript
import { colors, spacing } from './theme/colors';

<View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
  <ModernHeader title="Dashboard" />

  <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
    {/* Stats Grid */}
    <View style={{ gap: spacing.lg }}>
      <Text style={typography.h3}>Overview</Text>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <View style={{ flex: 1 }}>
          <AnimatedStatCard label="Total" value={42} icon="🚨" />
        </View>
        <View style={{ flex: 1 }}>
          <AnimatedStatCard label="Critical" value={5} icon="🔴" />
        </View>
      </View>

      {/* Full width cards */}
      <AIInsightCard
        title="System Alert"
        description="Critical issues detected"
        severity="critical"
      />

      {/* Content section */}
      <AIInsightsDashboard stats={stats} potholes={potholes} />
    </View>
  </ScrollView>

  {/* FAB */}
  <FloatingActionButton
    onPress={() => refresh()}
    icon="🔄"
    variant="primary"
  />
</View>
```

### Modal Pattern

```javascript
const [modalVisible, setModalVisible] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

const handleItemPress = (item) => {
  setSelectedItem(item);
  setModalVisible(true);
};

return (
  <>
    {/* Main content */}
    <View>
      {items.map(item => (
        <GlassCard
          key={item.id}
          onPress={() => handleItemPress(item)}
        >
          {/* Item content */}
        </GlassCard>
      ))}
    </View>

    {/* Modal */}
    <PotholeBottomSheet
      visible={modalVisible}
      pothole={selectedItem}
      onClose={() => setModalVisible(false)}
      onConfirm={(id, exists) => handleConfirm(id, exists)}
    />
  </>
);
```

### Themed ScrollView

```javascript
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from './theme/colors';

<LinearGradient
  colors={[colors.bg_primary, colors.bg_secondary]}
  style={{ flex: 1 }}
>
  <ScrollView
    contentContainerStyle={{
      padding: spacing.lg,
      gap: spacing.lg
    }}
  >
    {/* Content */}
  </ScrollView>
</LinearGradient>
```

## 🎬 Animation Patterns

### Animated Entrance

```javascript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useEffect
} from 'react-native-reanimated';

export function AnimatedCard() {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={animatedStyle}>
      <GlassCard>
        {/* Content */}
      </GlassCard>
    </Animated.View>
  );
}
```

### Animated List

```javascript
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withDelay,
  withSpring 
} from 'react-native-reanimated';

export function AnimatedList({ items }) {
  return (
    <View>
      {items.map((item, index) => (
        <AnimatedListItem
          key={item.id}
          item={item}
          delay={index * 100}
        />
      ))}
    </View>
  );
}

function AnimatedListItem({ item, delay }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withSpring(1)
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  return (
    <Animated.View style={style}>
      <GlassCard>{/* Content */}</GlassCard>
    </Animated.View>
  );
}
```

## 🔧 Common Patterns

### Confirmation Dialog

```javascript
const [visible, setVisible] = useState(false);

const showConfirmation = (item) => {
  setSelectedItem(item);
  setVisible(true);
};

<PotholeBottomSheet
  visible={visible}
  pothole={selectedItem}
  onClose={() => setVisible(false)}
  onConfirm={(id, exists) => {
    handleConfirm(id, exists);
    setVisible(false);
  }}
/>
```

### Pull to Refresh

```javascript
import { RefreshControl } from 'react-native';

const [refreshing, setRefreshing] = useState(false);

<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        fetchData().finally(() => setRefreshing(false));
      }}
      tintColor={colors.primary}
    />
  }
>
  {/* Content */}
</ScrollView>
```

---

## 💡 Best Practices

1. **Always wrap pages with LinearGradient** for consistent background
2. **Use ScrollView for long content** instead of overflow
3. **Keep spacing consistent** using the spacing system
4. **Group related stats** in grids for better UX
5. **Use colors intentionally** - each color has meaning
6. **Test animations** at 60fps on target devices
7. **Provide feedback** for user interactions
8. **Handle loading states** gracefully
9. **Show empty states** when no data exists
10. **Keep modals focused** - single purpose each

---

**Last Updated**: May 2026  
**Status**: ✨ Ready for Production
