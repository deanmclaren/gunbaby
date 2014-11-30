# Better Ruby Text Adventure!
# By Peter Cooper

# You can now go west, "take magic lamp", then travel somewhere and "drop magic lamp" and it'll stay there!
# Inspiration for you to push it further.. (hint: the player should probably become a class next)

class Item
        attr_accessor :name, :description
        def initialize(params)
                @name = params[:name]
                @description = params[:description]
        end
end

class Location
        attr_accessor :name, :description, :west, :east, :south, :north, :items

        def initialize(params)
                @name = params[:name]
                @description = params[:description]
                @items = []
        end

        # We have to create our own setter methods to do the mirrored east/west north/south relationships
        def west=(loc)
                @west = loc
                @west.east = self unless @west.east
        end

        def east=(loc)
                @east = loc
                @east.west = self unless @east.west
        end

        def south=(loc)
                @south = loc
                @south.north = self unless @south.north
        end

        def north=(loc)
                @north = loc
                @north.south = self unless @north.south
        end

        def exits
                exits = []
                exits << "west" if self.west
                exits << "east" if self.east
                exits << "south" if self.south
                exits << "north" if self.north
                exits
        end

        def contains_items?
                self.items && self.items.length > 0
        end
end



# Create a location
main_room = Location.new( :name => "Central Room" )
main_room.west = Location.new( :name => "West Room" )
main_room.east = Location.new( :name => "East Room" )
main_room.west.north = Location.new( :name => "The North of the West Room" )
main_room.west.north.north = Location.new( :name => "The Really Far North Room" )

# Create a lamp
lamp = Item.new( :name => "Magic Lamp", :description => "a golden lamp with magical powers" )

# Add the lamp to the west room
main_room.west.items << lamp
# Now the game logic really begins!

inventory = []
current_room = main_room

catch :end_of_game do
        loop do
                puts "You are in #{current_room.name}."
                puts "Items here: #{current_room.items.collect{|item| item.name }.join(", ")} " if current_room.contains_items?
                puts "Exits are to the #{current_room.exits.join(", ")}."
                puts "Which direction next?"
                instruction = gets
                next_room = case instruction.chomp
                        when "north"
                                current_room.north
                        when "south"
                                current_room.south
                        when "west"
                                current_room.west
                        when "east"
                                current_room.east
                        when "exit"
                                throw :end_of_game
                        when /^take (.+)$/
                                puts "Taking #{$1}"
                                inventory << current_room.items.find {|item| item.name.downcase == $1.downcase }
                                current_room.items.delete_if {|item| item.name.downcase == $1.downcase }
                                current_room
                        when /^drop (.+)$/
                                puts "Dropping #{$1}"
                                current_room.items << inventory.find {|item| item.name.downcase == $1.downcase }
                                current_room
                end
                if next_room
                        current_room = next_room
                else
                        puts "You can't go that way!"
                end
        end
end

puts "Bye bye!"
