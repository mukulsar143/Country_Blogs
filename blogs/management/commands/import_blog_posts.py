import csv
from django.core.management.base import BaseCommand
from blogs.models import BlogPost
from django.utils.text import slugify
from django.core.exceptions import ValidationError

class Command(BaseCommand):
    help = 'Import blog posts from a CSV file'

    def add_arguments(self, parser):
        """
        Add argument to pass the CSV file path to the command.
        """
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        """
        Handle the logic to import blog posts from the CSV file.
        """
        csv_file = kwargs['csv_file']
        imported_count = 0
        error_count = 0

        try:
            with open(csv_file, newline='', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                for row in reader:
                    title = row.get('title')
                    content = row.get('content')
                    country = row.get('country', '').strip()

                    # Check if the required fields are present
                    if not title or not content:
                        self.stdout.write(self.style.ERROR(f"Missing title or content in row: {row}"))
                        error_count += 1
                        continue

                    # Validate the data
                    try:
                        blog_post = BlogPost(
                            title=title,
                            content=content,
                            country=country if country else None
                        )
                        blog_post.save()
                        imported_count += 1
                    except ValidationError as e:
                        self.stdout.write(self.style.ERROR(f"Validation error: {e} in row: {row}"))
                        error_count += 1

            # Success message
            self.stdout.write(self.style.SUCCESS(f"Successfully imported {imported_count} blog posts"))
            if error_count > 0:
                self.stdout.write(self.style.WARNING(f"{error_count} errors occurred during the import"))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File not found: {csv_file}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {str(e)}"))
