import pandas as pd
from datasets import Dataset
from transformers import BertTokenizer, BertForSequenceClassification, TrainingArguments, Trainer

# Load the CSV dataset
csv_path = "../data/dataset.csv"  # Path to the dataset
df = pd.read_csv(csv_path, names=["bangla_text", "banglish_text"])

# Convert to Hugging Face Dataset
dataset = Dataset.from_pandas(df)

# Tokenizer and model setup
tokenizer = BertTokenizer.from_pretrained("bert-base-multilingual-cased")
model = BertForSequenceClassification.from_pretrained("bert-base-multilingual-cased")

# Tokenize the dataset
def preprocess_function(examples):
    return tokenizer(examples["banglish_text"], text_target=examples["bangla_text"], truncation=True)

tokenized_datasets = dataset.map(preprocess_function, batched=True)

# Training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
)

# Trainer setup
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets,
)

# Train the model
trainer.train()

# Save the fine-tuned model
model.save_pretrained("../data/fine_tuned_model")
tokenizer.save_pretrained("../data/fine_tuned_model")
