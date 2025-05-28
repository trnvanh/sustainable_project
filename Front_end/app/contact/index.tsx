import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TeamMember {
    name: string;
    role: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    email?: string;
}

const teamMembers: TeamMember[] = [
    {
        name: "Hero Eats Team",
        role: "Sustainable Food Platform",
        description: "We're passionate about connecting people with fresh, local, and sustainable food options while reducing food waste.",
        icon: "restaurant-outline",
    },
    {
        name: "Development Team",
        role: "Mobile & Backend Engineers",
        description: "Building innovative solutions to make sustainable eating accessible and convenient for everyone.",
        icon: "code-outline",
        email: "dev@heroeats.com"
    },
    {
        name: "Sustainability Team",
        role: "Environmental Impact Specialists",
        description: "Dedicated to reducing food waste and promoting eco-friendly practices in the food industry.",
        icon: "leaf-outline",
        email: "sustainability@heroeats.com"
    },
    {
        name: "Customer Success",
        role: "Support & Community",
        description: "Here to help you make the most of your Hero Eats experience and build a stronger community.",
        icon: "people-outline",
        email: "support@heroeats.com"
    }
];

export default function ContactScreen() {
    const { colors } = useTheme();

    const handleEmailPress = (email: string) => {
        // Handle email press - could open email client
        console.log('Email pressed:', email);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: colors.text }]}>Meet Hero Eats</Text>

                <View style={[styles.heroSection, { backgroundColor: colors.surface }]}>
                    <Ionicons name="heart" size={48} color={colors.primary} />
                    <Text style={[styles.heroTitle, { color: colors.primary }]}>
                        Our Mission
                    </Text>
                    <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>
                        Creating a sustainable future through innovative food technology,
                        connecting communities with fresh, local produce while minimizing waste.
                    </Text>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Team</Text>

                {teamMembers.map((member, index) => (
                    <View key={index} style={[styles.teamCard, { backgroundColor: colors.surface }]}>
                        <View style={styles.teamHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight + '20' }]}>
                                <Ionicons name={member.icon} size={24} color={colors.primary} />
                            </View>
                            <View style={styles.teamInfo}>
                                <Text style={[styles.memberName, { color: colors.text }]}>
                                    {member.name}
                                </Text>
                                <Text style={[styles.memberRole, { color: colors.primary }]}>
                                    {member.role}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.memberDescription, { color: colors.textSecondary }]}>
                            {member.description}
                        </Text>

                        {member.email && (
                            <TouchableOpacity
                                style={[styles.emailButton, { backgroundColor: colors.primary }]}
                                onPress={() => handleEmailPress(member.email!)}
                            >
                                <Ionicons name="mail" size={16} color="white" />
                                <Text style={styles.emailText}>{member.email}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <View style={[styles.contactSection, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.contactTitle, { color: colors.text }]}>
                        Get In Touch
                    </Text>
                    <Text style={[styles.contactDescription, { color: colors.textSecondary }]}>
                        Have questions, suggestions, or want to partner with us?
                        We'd love to hear from you!
                    </Text>

                    <View style={styles.contactMethods}>
                        <View style={styles.contactMethod}>
                            <Ionicons name="mail" size={20} color={colors.primary} />
                            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                                hello@heroeats.com
                            </Text>
                        </View>

                        <View style={styles.contactMethod}>
                            <Ionicons name="call" size={20} color={colors.primary} />
                            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                                +1 (555) 123-HERO
                            </Text>
                        </View>

                        <View style={styles.contactMethod}>
                            <Ionicons name="location" size={20} color={colors.primary} />
                            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                                Sustainable Food Hub, Green City
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 24,
        textAlign: 'center',
    },
    heroSection: {
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 12,
    },
    heroDescription: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 16,
    },
    teamCard: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    teamHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    teamInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    memberRole: {
        fontSize: 14,
        fontWeight: '500',
    },
    memberDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    emailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    emailText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 6,
    },
    contactSection: {
        padding: 24,
        borderRadius: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    contactTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    contactDescription: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    contactMethods: {
        gap: 12,
    },
    contactMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    contactText: {
        fontSize: 14,
        marginLeft: 12,
    },
});
