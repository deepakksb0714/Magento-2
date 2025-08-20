namespace :db do
  desc "Reset and set up the primary database"
  task reset_primary: :environment do
    ActiveRecord::Base.establish_connection(:primary)

    puts "Dropping the primary database..."
    Rake::Task["db:drop"].invoke

    puts "Creating the primary database..."
    Rake::Task["db:create"].invoke

    puts "Running migrations on primary database..."
    Rake::Task["db:migrate"].invoke

    puts "Seeding the primary database..."
    Rake::Task["db:seed"].invoke

    puts "Primary database reset and setup completed!"
  end
end
# rake db:reset_primary
