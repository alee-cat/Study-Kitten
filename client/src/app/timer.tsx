import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TimerScreen() {
    const [secondsLeft, setSecondsLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    useEffect(() => {
        if (!isRunning || secondsLeft <= 0) {
          return;
        }
      
        const timer = setInterval(() => {
          setSecondsLeft((previous) => previous - 1);
        }, 1000);
      
        return () => clearInterval(timer);
      }, [isRunning, secondsLeft]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Study Timer ⏱️</Text>
            <Text style={styles.subtitle}>
                Focus with your study kitten!
            </Text>

            <View style={styles.timerCard}>
                <Text style={styles.timer}>{formattedTime}</Text>
                <Text style={styles.focusText}>Focus Time</Text>
                
                <Pressable
                    style={styles.timerButton}
                    onPress={() => setIsRunning(!isRunning)}
                    >
                    <Text style={styles.timerButtonText}>
                        {isRunning ? 'Pause' : 'Start'}
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.resetButton}
                    onPress={() => {
                        setSecondsLeft(25 * 60);
                        setIsRunning(false);
                    }}
                    >
                    <Text style={styles.resetButtonText}>Reset</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFF7FC',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },

  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },

  timerCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 50,
  },

  timer: {
    fontSize: 56,
    fontWeight: 'bold',
  },

  focusText: {
    fontSize: 16,
    marginTop: 8,
  },

  timerButton: {
    marginTop: 20,
    backgroundColor: '#F2D7E9',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  
  timerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  resetButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});