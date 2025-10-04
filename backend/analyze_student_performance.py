import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text
from mlxtend.frequent_patterns import apriori, association_rules

# 1. Load the data
df = pd.read_csv('data/student_performance.csv')

# Use correct column name for performance
performance_col = 'PerformanceLevel'

# 2. Prepare features and labels
feature_cols = ['Attendance', 'Assignments', 'Tutorials', 'Volunteering', 'MOOCs', 'EventsParticipation']
X = df[feature_cols]
y = df[performance_col]  # High, Medium, Low

# 3. Train Decision Tree Classifier
dt = DecisionTreeClassifier(max_depth=3, random_state=42)
dt.fit(X, y)

# 4. Print interpretable rules
print("\n--- Decision Tree Rules ---")
tree_rules = export_text(dt, feature_names=feature_cols)
print(tree_rules)

# 5. Predict categories
df['Predicted_Performance'] = dt.predict(X)
print("\n--- Predicted Performance ---")
print(df[['Predicted_Performance']].value_counts())

# 6. Apriori Analysis
apriori_cols = ['Assignments', 'Tutorials', performance_col]
binned_df = df.copy()
for col in ['Assignments', 'Tutorials']:
    binned_df[col+'_Low'] = binned_df[col] < binned_df[col].median()
    binned_df[col+'_High'] = binned_df[col] >= binned_df[col].median()

# Make a boolean dataframe for Apriori
apriori_df = binned_df[[col+'_Low' for col in ['Assignments', 'Tutorials']] +
                       [col+'_High' for col in ['Assignments', 'Tutorials']] +
                       [performance_col]]

# One-hot encode PerformanceLevel
apriori_df = pd.get_dummies(apriori_df, columns=[performance_col])

# Run Apriori
frequent_itemsets = apriori(apriori_df, min_support=0.2, use_colnames=True)
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.6)

print("\n--- Apriori Association Rules ---")
for idx, rule in rules.iterrows():
    antecedents = ', '.join([str(a) for a in rule['antecedents']])
    consequents = ', '.join([str(c) for c in rule['consequents']])
    print(f"If [{antecedents}] --> [{consequents}]: support={rule['support']:.2f}, confidence={rule['confidence']:.2f}")

# 7. (Optional) Save results for dashboard/frontend
df.to_csv('data/student_performance_with_predictions.csv', index=False)
rules.to_csv('data/performance_association_rules.csv', index=False)

print("\nResults saved to 'data/student_performance_with_predictions.csv' and 'data/performance_association_rules.csv'")
print("ML pipeline completed!")